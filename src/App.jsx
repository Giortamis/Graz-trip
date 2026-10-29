import { useEffect, useMemo, useState } from 'react'
import PlaceActions from './components/PlaceActions.jsx'
import { trip, days, blocksByDay } from './data/itinerary'
const STORAGE_KEY = 'graz-trip-live-v1'
function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function fmtClock(value, timeZone = trip.timeZone) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('el-GR', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    hour12: false,
  }).format(date)
}

function fmtFull(value) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('el-GR', {
    timeZone: trip.timeZone,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    hour12: false,
  }).format(date)
}

function tripClock(date) {
  return new Intl.DateTimeFormat('el-GR', {
    timeZone: trip.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    hour12: false,
    second: '2-digit',
  }).format(date)
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000)
}

function mapUrl(query, mode = 'walking', origin = null) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=${mode}${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`
}

function getBlockState(liveState, blockId) {
  return liveState?.[blockId] || { startedAt: null, completed: {} }
}

function getSchedule(block, state) {
  let cursor = state.startedAt ? new Date(state.startedAt) : new Date(block.plannedStart || Date.now())

  return block.activities.map((activity, index) => {
    const completedAt = state.completed?.[activity.id] ? new Date(state.completed[activity.id]) : null
    let estimatedStart = addMinutes(cursor, activity.gapBefore || 0)
    if (activity.fixedStart) {
      const fixed = new Date(activity.fixedStart)
      estimatedStart = activity.type === 'rest'
        ? new Date(Math.max(estimatedStart.getTime(), fixed.getTime()))
        : fixed
    }
    const estimatedEnd = activity.restUntil
      ? new Date(Math.max(
          addMinutes(estimatedStart, activity.minDuration || 0).getTime(),
          new Date(activity.restUntil).getTime(),
        ))
      : addMinutes(estimatedStart, activity.duration)
    cursor = completedAt || estimatedEnd

    return {
      ...activity,
      duration: activity.restUntil ? Math.round((estimatedEnd - estimatedStart) / 60000) : activity.duration,
      index,
      completedAt,
      estimatedStart,
      estimatedEnd,
    }
  })
}

function getCurrentIndex(schedule) {
  const idx = schedule.findIndex((item) => !item.completedAt)
  return idx === -1 ? schedule.length : idx
}

function getAnchorInfo(block, state) {
  const schedule = getSchedule(block, state)
  const currentIndex = getCurrentIndex(schedule)

  const candidates = schedule
    .map((item, index) => {
      if (index < currentIndex || item.completedAt) return null
      if (item.deadlineAt) {
        return {
          item,
          index,
          anchor: new Date(item.deadlineAt),
          label: item.deadlineLabel || item.title,
          deadlineOnItem: true,
        }
      }
      if (item.fixedStart && item.type !== 'rest') {
        return {
          item,
          index,
          anchor: new Date(item.fixedStart),
          label: item.title,
          deadlineOnItem: false,
        }
      }
      return null
    })
    .filter(Boolean)
    .sort((a, b) => a.anchor - b.anchor)

  const next = candidates[0]
  if (!next) return null

  const before = next.deadlineOnItem
    ? schedule.slice(currentIndex, next.index + 1)
    : schedule.slice(currentIndex, next.index)

  const lastBefore = before[before.length - 1]
  const projectedArrival = lastBefore?.completedAt || lastBefore?.estimatedEnd || new Date()
  const diff = Math.round((next.anchor - projectedArrival) / 60000)

  return {
    anchor: next.anchor,
    fixed: next.item,
    label: next.label,
    diff,
    projectedArrival,
  }
}

function assetUrl(path) {
  return path?.startsWith('images/') ? import.meta.env.BASE_URL + path : path
}

function StatusBadges({ statuses = [] }) {
  return <div className="status-badges">{statuses.map(status =>
    <span key={status.label} className={'status-badge ' + status.tone}>{status.label}</span>
  )}</div>
}

function PhotoButton({ photo, onOpenPhoto }) {
  return photo && <button className="landmark-thumb" onClick={() => onOpenPhoto(photo)}
    aria-label={'Μεγέθυνση φωτογραφίας: ' + photo.alt}>
    <img src={assetUrl(photo.thumb)} alt={photo.alt} loading="lazy" />
    <span>🔍 Μεγέθυνση</span>
  </button>
}

function ActivityDetails({ item, onOpenPhoto }) {
  const multiplePlaces = item.stops?.length > 1
  return <>
    {item.note && <p className="activity-note">{item.note}</p>}
    {!!item.stops?.length && <div className="place-cards">
      {item.stops.map((place, i) => <div className={multiplePlaces ? 'place-card' : 'place-card single-place'} key={place.id || place.address}>
        {multiplePlaces && <>
          {i > 0 && <PhotoButton photo={place.photo} onOpenPhoto={onOpenPhoto} />}
          <strong>{place.name}</strong><p>{place.description}</p>
        </>}
        {place.address && <small>{place.address}</small>}
        <PlaceActions place={place} hideMap={item.disableNavigation || item.hideMaps} />
      </div>)}
    </div>}
    {!item.stops?.length && <PlaceActions place={{
      name: item.title,
      mapUrl: item.mapUrl || (item.destination ? mapUrl(item.destination, item.mode, item.origin) : undefined),
      website: item.website, phone: item.phone, email: item.email,
    }} hideMap={item.disableNavigation || item.hideMaps} />}
    {!!item.legs?.length && <details className="transport-details">
      <summary>Μετακίνηση · {item.legs.map(l => l.line).join(' → ')}</summary>
      <p className="estimate-note">Εκτιμώμενοι χρόνοι · περιλαμβάνονται στο slot όπου αναφέρεται.</p>
      <ol>{item.legs.map((leg, i) => <li key={i}>
        <strong>{leg.line}{leg.direction ? ' · προς ' + leg.direction : ''}</strong>
        <span>Από: {leg.from}</span><span>Έως: {leg.to}</span>
        <small>{leg.estimate}</small>
        {!item.disableNavigation && !item.hideMaps && ['walking','transit','driving'].includes(leg.mode) &&
          <PlaceActions place={{name: leg.from + ' → ' + leg.to, mapUrl: mapUrl(leg.to, leg.mode, leg.from)}} />}
      </li>)}</ol>
    </details>}
  </>
}

function LiveBlock({ block, liveState, onStart, onEnd, onReset, onOpenPhoto }) {
  const state = getBlockState(liveState, block.id)
  const schedule = getSchedule(block, state)
  const isStatic = block.static === true
  const currentIndex = getCurrentIndex(schedule)
  const anchorInfo = isStatic ? null : getAnchorInfo(block, state)
  const complete = !isStatic && currentIndex >= schedule.length

  return (
    <section className="live-block">
      <div className="block-head">
        <div>
          <p className="block-kicker">{block.title}</p>
          {!isStatic && <h3>{state.startedAt ? `START: ${fmtFull(state.startedAt)}` : block.plannedStart ? `Προγραμματισμένο START: ${fmtClock(block.plannedStart)}` : 'START όταν είστε έτοιμοι'}</h3>}
          {block.startHint && <p>{block.startHint}</p>}
        </div>

        {!isStatic && (state.startedAt ? (
          <button className="reset-button" onClick={() => onReset(block.id)}>↺ Reset</button>
        ) : (
          <button className="start-button" onClick={() => onStart(block.id)}>{block.startLabel}</button>
        ))}
      </div>

      {!isStatic && state.startedAt && !complete && (
        <div className="live-now">
          <div className="pulse-dot" />
          <div>
            <span>ΤΩΡΑ</span>
            <strong>{schedule[currentIndex].title}</strong>
            <small>
              Ξεκίνησε/υπολογίζεται {fmtClock(schedule[currentIndex].estimatedStart)}
              {schedule[currentIndex].type !== 'fixed' && ` · στόχος END ${fmtClock(schedule[currentIndex].estimatedEnd)}`}
            </small>
          </div>
        </div>
      )}

      {!isStatic && anchorInfo && state.startedAt && (
        <div className={anchorInfo.diff < 45 ? 'anchor-warning danger' : 'anchor-warning'}>
          <span>⚓ Επόμενο σταθερό deadline</span>
          <strong>{anchorInfo.label} · {fmtClock(anchorInfo.anchor)}</strong>
          <small>
            Προβλεπόμενη ολοκλήρωση πριν το deadline: {fmtClock(anchorInfo.projectedArrival)}
            {' · '}
            {anchorInfo.diff >= 0 ? `περιθώριο ~${anchorInfo.diff}′` : `καθυστέρηση ~${Math.abs(anchorInfo.diff)}′`}
          </small>
        </div>
      )}

      <div className="activities-list">
        {schedule.map((item, index) => {
          const done = Boolean(item.completedAt)
          const current = !isStatic && state.startedAt && index === currentIndex
          const future = !isStatic && state.startedAt && index > currentIndex
          const nextItem = schedule[index + 1]
          const nextNeedsNavigation = Boolean(
            current &&
            !item.disableNavigation && !item.hideMaps && !item.disableAutoNavigation &&
            !nextItem?.disableNavigation && !nextItem?.hideMaps && !nextItem?.disableAutoNavigation &&
            nextItem?.destination &&
            nextItem.destination !== item.destination
          )

          return (
            <article
              key={item.id}
              id={item.id}
              data-category={item.category || item.type}
              className={[
                'activity-row',
                done ? 'done' : '',
                current ? 'current' : '',
                future ? 'future' : '',
                item.fixedStart ? 'fixed' : '',
              ].join(' ')}
            >
              <div className="activity-icon">{done ? '✓' : item.icon}</div>

              <div className="activity-main">
                <PhotoButton photo={item.photo} onOpenPhoto={onOpenPhoto} />

                <div className="activity-meta">
                  <span className={item.type === 'route' ? 'type route' : item.type === 'fixed' ? 'type fixed' : 'type'}>
                    {item.typeLabel || (item.type === 'route' ? 'ΔΙΑΔΡΟΜΗ' : item.type === 'rest' ? 'REST' : item.type === 'meal' ? 'ΓΕΥΜΑ' : item.type === 'fixed' ? item.fixedLabel || 'ΔΡΑΣΗ' : 'ΔΡΑΣΗ')}
                  </span>
                  <span>
                    {block.dynamicTimes && state.startedAt && !item.fixedStart
                      ? (item.duration
                        ? `${fmtClock(item.estimatedStart, item.timeZone || trip.timeZone)}–${fmtClock(item.estimatedEnd, item.timeZone || trip.timeZone)}`
                        : fmtClock(item.estimatedStart, item.timeZone || trip.timeZone))
                      : (item.scheduleLabel || fmtClock(item.plannedStart || item.estimatedStart))}
                  </span>
                </div>

                <div className="duration-label">⏱ {item.durationLabel || (item.duration > 0 ? item.duration + '′ συνολικό slot' : 'Στιγμή / χωρίς ορισμένη διάρκεια')}</div>
                {!isStatic && state.startedAt && <p className="live-time">{done
                  ? 'Πραγματικό END ' + fmtFull(item.completedAt)
                  : 'Εκτίμηση ' + fmtClock(item.estimatedStart, item.timeZone || trip.timeZone)
                    + (item.duration ? '–' + fmtClock(item.estimatedEnd, item.timeZone || trip.timeZone) : '')
                    + (item.timeZone === 'Europe/Athens' ? ' ώρα Ελλάδας' : '')}</p>}
                <StatusBadges statuses={item.statuses} />
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                {item.address && <p>{item.address}</p>}
                <ActivityDetails item={item} onOpenPhoto={onOpenPhoto} />

                <div className="activity-actions">

                  {current && (
                    <button
                      className="end-button"
                      onClick={() => onEnd(
                        block.id,
                        item.id,
                        nextNeedsNavigation ? nextItem.destination : null,
                        nextNeedsNavigation ? nextItem.mode : null,
                        nextNeedsNavigation ? nextItem.origin : null,
                      )}
                    >
                      {nextNeedsNavigation ? '✓ END → GOOGLE MAPS' : '✓ END'}
                    </button>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {!isStatic && complete && (
        <div className="block-complete">
          ✅ Το μπλοκ ολοκληρώθηκε. Όλες οι πραγματικές ώρες END έχουν αποθηκευτεί στο κινητό.
        </div>
      )}
    </section>
  )
}

export default function App() {
  const [now, setNow] = useState(new Date())
  const [activeDay, setActiveDay] = useState(days[0].id)
  const [liveState, setLiveState] = useState(() => loadState())
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    saveState(liveState)
  }, [liveState])

  useEffect(() => {
    if (!selectedPhoto) return
    const previous = document.activeElement
    const onKey = event => { if (event.key === 'Escape') setSelectedPhoto(null) }
    document.addEventListener('keydown', onKey)
    document.querySelector('.photo-close')?.focus()
    return () => { document.removeEventListener('keydown', onKey); previous?.focus() }
  }, [selectedPhoto])

  const selected = useMemo(
    () => days.find((day) => day.id === activeDay) ?? days[0],
    [activeDay],
  )

  function startBlock(blockId) {
    setLiveState((prev) => ({
      ...prev,
      [blockId]: {
        startedAt: new Date().toISOString(),
        completed: {},
      },
    }))
  }

  function endActivity(blockId, activityId, nextDestination = null, nextMode = 'walking', nextOrigin = null) {
    const blockState = getBlockState(liveState, blockId)
    const nextState = {
      ...liveState,
      [blockId]: {
        ...blockState,
        completed: {
          ...blockState.completed,
          [activityId]: new Date().toISOString(),
        },
      },
    }

    saveState(nextState)
    setLiveState(nextState)

    if (nextDestination) {
      window.location.assign(mapUrl(nextDestination, nextMode || 'walking', nextOrigin))
    }
  }

  function resetBlock(blockId) {
    const ok = window.confirm('Να μηδενιστεί αυτό το μπλοκ και να διαγραφούν οι δοκιμαστικές ώρες START/END;')
    if (!ok) return

    setLiveState((prev) => {
      const next = { ...prev }
      delete next[blockId]
      return next
    })
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">{trip.eyebrow}</p>
          <h1>{trip.title}</h1>
          <p className="trip-dates">{trip.currencyLabel}</p>
          <p className="trip-dates">{trip.datesLabel}</p>
        </div>
        <div className="clock-card">
          <span>{trip.clockLabel}</span>
          <strong>{tripClock(now)}</strong>
        </div>
      </header>

      <p className="time-note">{trip.timeNote}</p>
      {activeDay === 'thu' && <div className="match-banner"><strong>{trip.priority.title}</strong><span>{trip.priority.label}</span></div>}
      <nav className="day-tabs" aria-label="Ημέρες ταξιδιού">
        {days.map((day) => (
          <button
            key={day.id}
            className={day.id === activeDay ? 'day-tab active' : 'day-tab'}
            onClick={() => setActiveDay(day.id)}
          >
            <span>{day.short}</span>
            <strong>{day.date}</strong>
          </button>
        ))}
      </nav>

      <section className="day-heading">
        <p>{selected.city}</p>
        <h2>{selected.title}</h2>
      </section>

      <>
        {(blocksByDay[activeDay] || []).map((block) => (
          <LiveBlock
            key={block.id}
            block={block}
            liveState={liveState}
            onStart={startBlock}
            onEnd={endActivity}
            onReset={resetBlock}
            onOpenPhoto={setSelectedPhoto}
          />
        ))}

        <section className="logic-card">
          <strong>Πώς δουλεύει</strong>
          <p>
            Όπου υπάρχει START, η πραγματική ώρα εκκίνησης γίνεται η βάση για τις επόμενες δραστηριότητες.
            Μετά χρησιμοποιούμε END. Οι δυναμικές ώρες προσαρμόζονται αυτόματα, ενώ τα σταθερά deadlines δεν μετακινούνται.
          </p>
        </section>
      </>

      {selectedPhoto && (
        <div className="photo-modal" role="dialog" aria-modal="true" aria-label={selectedPhoto.alt} onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="photo-close" onClick={() => setSelectedPhoto(null)} aria-label="Κλείσιμο">×</button>
            <img src={assetUrl(selectedPhoto.full)} alt={selectedPhoto.alt} />
            <div className="photo-caption">
              <strong>{selectedPhoto.alt}</strong>
              {selectedPhoto.license && <span>{selectedPhoto.license}</span>}
              {selectedPhoto.source && selectedPhoto.source !== '#' ? (
                <a href={selectedPhoto.source} target="_blank" rel="noreferrer">{selectedPhoto.credit}</a>
              ) : (
                <span>{selectedPhoto.credit}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
