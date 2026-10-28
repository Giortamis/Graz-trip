import { useEffect, useMemo, useState } from 'react'
import { trip, days, blocksByDay, prestartByDay } from './data/itinerary'
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

function fmtClock(value) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('el-GR', {
    timeZone: trip.timeZone,
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
    let estimatedStart = cursor

    if (activity.type === 'fixed') {
      const fixed = new Date(activity.fixedStart)
      estimatedStart = fixed
    }

    const estimatedEnd = activity.restUntil
      ? new Date(Math.max(estimatedStart.getTime(), new Date(activity.restUntil).getTime()))
      : addMinutes(estimatedStart, activity.duration)

    if (completedAt) {
      cursor = completedAt
    } else if (activity.type === 'fixed') {
      cursor = estimatedEnd
    } else {
      cursor = estimatedEnd
    }

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
      if (item.type === 'fixed') {
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

function LiveBlock({ block, liveState, onStart, onEnd, onReset, onOpenPhoto }) {
  const state = getBlockState(liveState, block.id)
  const schedule = getSchedule(block, state)
  const currentIndex = getCurrentIndex(schedule)
  const anchorInfo = getAnchorInfo(block, state)
  const complete = currentIndex >= schedule.length

  return (
    <section className="live-block">
      <div className="block-head">
        <div>
          <p className="block-kicker">{block.title}</p>
          <h3>{state.startedAt ? `START: ${fmtFull(state.startedAt)}` : block.plannedStart ? `Προγραμματισμένο START: ${fmtClock(block.plannedStart)}` : 'START όταν είστε έτοιμοι'}</h3>
          <p>{block.startHint}</p>
        </div>

        {state.startedAt ? (
          <button className="reset-button" onClick={() => onReset(block.id)}>↺ Reset</button>
        ) : (
          <button className="start-button" onClick={() => onStart(block.id)}>{block.startLabel}</button>
        )}
      </div>

      {state.startedAt && !complete && (
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

      {anchorInfo && state.startedAt && (
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
          const current = state.startedAt && index === currentIndex
          const future = state.startedAt && index > currentIndex
          const nextItem = schedule[index + 1]
          const nextNeedsNavigation = Boolean(
            current &&
            !item.disableNavigation &&
            nextItem?.destination &&
            nextItem.destination !== item.destination
          )

          return (
            <article
              key={item.id}
              className={[
                'activity-row',
                done ? 'done' : '',
                current ? 'current' : '',
                future ? 'future' : '',
                item.type === 'fixed' ? 'fixed' : '',
              ].join(' ')}
            >
              <div className="activity-icon">{done ? '✓' : item.icon}</div>

              <div className="activity-main">
                {item.photo && (
                  <button
                    className="landmark-thumb"
                    onClick={() => onOpenPhoto(item.photo)}
                    aria-label={`Μεγέθυνση φωτογραφίας: ${item.photo.alt}`}
                  >
                    <img src={item.photo.thumb} alt={item.photo.alt} loading="lazy" />
                    <span>🔍 Μεγέθυνση</span>
                  </button>
                )}

                <div className="activity-meta">
                  <span className={item.type === 'route' ? 'type route' : item.type === 'fixed' ? 'type fixed' : 'type'}>
                    {item.typeLabel || (item.type === 'route' ? 'ΔΙΑΔΡΟΜΗ' : item.type === 'rest' ? 'REST' : item.type === 'meal' ? 'ΓΕΥΜΑ' : item.type === 'fixed' ? item.fixedLabel || 'ΔΡΑΣΗ' : 'ΔΡΑΣΗ')}
                  </span>
                  <span>
                    {done
                      ? `END ${fmtClock(item.completedAt)}`
                      : !state.startedAt && !block.plannedStart
                        ? 'Μετά το START'
                        : item.type === 'fixed'
                        ? (item.timeLabel || fmtClock(item.fixedStart))
                        : item.restUntil || item.showTimeRange
                          ? `${fmtClock(item.estimatedStart)}–${fmtClock(item.estimatedEnd)}`
                          : `${fmtClock(item.estimatedStart)} → ${fmtClock(item.estimatedEnd)}`}
                  </span>
                </div>

                <h4>{item.title}</h4>
                <p>{item.description}</p>
                {item.address && <p>{item.address}</p>}

                <div className="activity-actions">
                  {item.destination && !item.disableNavigation && (
                    <a
                      className="maps-button"
                      href={mapUrl(item.destination, item.mode, item.origin)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📍 Google Maps
                    </a>
                  )}

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

      {complete && (
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
          <p className="trip-dates">{trip.datesLabel}</p>
        </div>
        <div className="clock-card">
          <span>{trip.clockLabel}</span>
          <strong>{tripClock(now)}</strong>
        </div>
      </header>

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
        <section className="prestart-card">
          <div>
            <span>ΠΡΙΝ ΤΟ START</span>
            <strong>{prestartByDay[activeDay].title}</strong>
            <p>{prestartByDay[activeDay].text}</p>
          </div>
        </section>

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
            START μόνο στην αρχή κάθε μπλοκ. Μετά χρησιμοποιούμε END. Η πραγματική ώρα END γίνεται η βάση
            για την επόμενη δραστηριότητα. Όπου η επόμενη στάση είναι αλλού, το END ανοίγει και Google Maps.
            Τα σταθερά deadlines δεν μετακινούνται.
          </p>
        </section>
      </>

      {selectedPhoto && (
        <div className="photo-modal" role="dialog" aria-modal="true" aria-label={selectedPhoto.alt} onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="photo-close" onClick={() => setSelectedPhoto(null)} aria-label="Κλείσιμο">×</button>
            <img src={selectedPhoto.full} alt={selectedPhoto.alt} />
            <div className="photo-caption">
              <strong>{selectedPhoto.alt}</strong>
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
