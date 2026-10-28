import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { trip, days, blocksByDay, prestartByDay, reservationItems } from '../src/data/itinerary.js'

import { places } from '../src/data/places.js'

const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const storage = new Map()
const context = vm.createContext({
  trip, Date, Intl,
  localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  },
})
vm.runInContext(source.slice(source.indexOf('const STORAGE_KEY'), source.indexOf('function assetUrl')), context)
const { getSchedule, getCurrentIndex, getAnchorInfo, mapUrl, loadState, saveState, fmtClock } = context
// Synthetic dates and addresses below are test fixtures only, never itinerary content.
const start = '2030-01-01T09:00:00Z'
const activity = (id, duration, extra = {}) => ({ id, type: 'activity', duration, ...extra })
const block = activities => ({ id: 'test-block', plannedStart: start, activities })
const state = { startedAt: null, completed: {} }

test('four supplied days preserve every planned start and end without live progress', () => {
  assert.equal(days.length, 4)
  const ids = new Set()
  for (const day of days) {
    assert.ok(prestartByDay[day.id])
    for (const itemBlock of blocksByDay[day.id]) {
      const schedule = getSchedule(itemBlock, state)
      for (const item of schedule) {
        assert.ok(!ids.has(item.id), item.id)
        ids.add(item.id)
        assert.equal(item.estimatedStart.getTime(), Date.parse(item.plannedStart), item.id)
        if (item.plannedEnd) assert.equal(item.estimatedEnd.getTime(), Date.parse(item.plannedEnd), item.id)
        assert.ok(item.duration >= 0)
      }
    }
  }
  assert.equal(reservationItems.length, 17)
  assert.equal(reservationItems.find(i => i.id === '21-ofi').label, 'MAIN EVENT')
  assert.equal(reservationItems.filter(i => i.label === 'BOOKED').length, 2)
})

test('every place has a local thumbnail, enlarged photo and source attribution', () => {
  assert.equal(Object.keys(places).length, 33)
  for (const place of Object.values(places)) {
    assert.ok(place.address && place.description && place.website, place.id)
    assert.ok(place.photo?.credit && place.photo?.source, place.id)
    for (const field of ['full','thumb']) {
      assert.ok(existsSync(new URL('../public/' + place.photo[field], import.meta.url)), place.id)
    }
  }
})

test('all routes have endpoints and supported modes; known public transport has directions', () => {
  for (const itemBlock of Object.values(blocksByDay).flat()) {
    for (const item of itemBlock.activities) {
      if (item.type === 'route') {
        assert.ok(item.origin && item.destination, item.id)
        assert.ok(['walking','transit','driving'].includes(item.mode), item.id)
      }
      for (const leg of item.legs || []) {
        assert.ok(leg.from && leg.to && leg.estimate, item.id)
        if (leg.mode === 'transit') assert.ok(leg.line && leg.direction, item.id)
      }
    }
  }
})

test('fixed trains anchor even when their type is route; REST retains all 90 minutes if late', () => {
  const trainBlock = blocksByDay.fri.find(b => b.id === 'fri-train')
  const schedule = getSchedule(trainBlock, {startedAt:'2027-01-22T15:30:00+01:00',completed:{}})
  assert.equal(schedule.find(i => i.id === '22-rj753').estimatedStart.toISOString(), '2027-01-22T14:00:00.000Z')
  assert.ok(getAnchorInfo(trainBlock, {startedAt:'2027-01-22T15:30:00+01:00',completed:{}}).diff < 0)
  const rest = blocksByDay.sat[0].activities.find(i => i.type === 'rest')
  const delayed = getSchedule(block([rest]), {startedAt:'2027-01-23T15:20:00+01:00',completed:{}})[0]
  assert.equal(delayed.duration, 90)
  assert.equal(delayed.estimatedEnd.toISOString(), '2027-01-23T15:50:00.000Z')
})

test('durations accumulate from START; actual END moves the next activity', () => {
  const fixture = block([activity('a', 30), activity('b', 45), activity('c', 10)])
  const schedule = getSchedule(fixture, { startedAt: start, completed: { a: '2030-01-01T09:40:00Z' } })
  assert.equal(schedule[0].estimatedEnd.toISOString(), '2030-01-01T09:30:00.000Z')
  assert.equal(schedule[1].estimatedStart.toISOString(), '2030-01-01T09:40:00.000Z')
  assert.equal(schedule[2].estimatedEnd.toISOString(), '2030-01-01T10:35:00.000Z')
  assert.equal(getCurrentIndex(schedule), 1)
})

test('fixed events keep their time and expose late-arrival warnings', () => {
  const fixture = block([activity('a', 75), activity('fixed', 20, { type: 'fixed', fixedStart: '2030-01-01T10:00:00Z' }), activity('b', 10)])
  const schedule = getSchedule(fixture, state)
  assert.equal(schedule[1].estimatedStart.toISOString(), '2030-01-01T10:00:00.000Z')
  assert.equal(schedule[2].estimatedStart.toISOString(), '2030-01-01T10:20:00.000Z')
  assert.equal(getAnchorInfo(fixture, state).diff, -15)
})

test('REST ends at restUntil and never produces a negative duration', () => {
  const fixture = block([activity('rest', 0, { type: 'rest', restUntil: '2030-01-01T10:00:00Z' }), activity('b', 15)])
  const onTime = getSchedule(fixture, state)
  assert.equal(onTime[0].duration, 60)
  assert.equal(onTime[1].estimatedStart.toISOString(), '2030-01-01T10:00:00.000Z')
  const late = getSchedule(fixture, { startedAt: '2030-01-01T11:00:00Z', completed: {} })
  assert.equal(late[0].duration, 0)
  assert.equal(late[1].estimatedStart.toISOString(), '2030-01-01T11:00:00.000Z')
})

test('Google Maps preserves exact origin, destination and both travel modes', () => {
  for (const mode of ['walking', 'driving', 'transit']) {
    const url = new URL(mapUrl('Test destination 2, A & B', mode, 'Test origin 1, Α'))
    assert.equal(url.origin, 'https://www.google.com')
    assert.equal(url.searchParams.get('api'), '1')
    assert.equal(url.searchParams.get('origin'), 'Test origin 1, Α')
    assert.equal(url.searchParams.get('destination'), 'Test destination 2, A & B')
    assert.equal(url.searchParams.get('travelmode'), mode)
  }
})

test('state round-trips under its exact independent key and survives invalid JSON', () => {
  storage.clear()
  const value = { 'test-block': { startedAt: start, completed: { a: start } } }
  saveState(value)
  assert.deepEqual([...storage.keys()], ['graz-trip-live-v1'])
  assert.equal(JSON.stringify(loadState()), JSON.stringify(value))
  storage.set('graz-trip-live-v1', 'invalid')
  assert.equal(JSON.stringify(loadState()), '{}')
  storage.clear()
})

test('all END timestamps mark a block complete', () => {
  const schedule = getSchedule(block([activity('a', 1)]), { startedAt: start, completed: { a: start } })
  assert.equal(getCurrentIndex(schedule), schedule.length)
})

test('clock respects Austrian standard and daylight saving time', () => {
  assert.equal(fmtClock('2030-01-01T09:00:00Z'), '10:00')
  assert.equal(fmtClock('2030-07-01T09:00:00Z'), '11:00')
})
