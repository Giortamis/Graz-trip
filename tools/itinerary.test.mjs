import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { trip, days, blocksByDay, prestartByDay } from '../src/data/itinerary.js'

const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const storage = new Map()
const context = vm.createContext({
  trip, Date, Intl,
  localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  },
})
vm.runInContext(source.slice(source.indexOf('const STORAGE_KEY'), source.indexOf('function LiveBlock')), context)
const { getSchedule, getCurrentIndex, getAnchorInfo, mapUrl, loadState, saveState, fmtClock } = context
// Synthetic dates and addresses below are test fixtures only, never itinerary content.
const start = '2030-01-01T09:00:00Z'
const activity = (id, duration, extra = {}) => ({ id, type: 'activity', duration, ...extra })
const block = activities => ({ id: 'test-block', plannedStart: start, activities })
const state = { startedAt: null, completed: {} }

test('placeholder has no dates, destinations, photos or invented durations', () => {
  assert.equal(days.length, 1)
  assert.equal(trip.timeZone, 'Europe/Vienna')
  for (const day of days) {
    assert.ok(prestartByDay[day.id])
    for (const itemBlock of blocksByDay[day.id]) {
      assert.equal(itemBlock.plannedStart, null)
      for (const item of itemBlock.activities) {
        assert.equal(item.duration, 0)
        assert.equal(item.disableNavigation, true)
        for (const field of ['origin', 'destination', 'fixedStart', 'restUntil', 'photo']) {
          assert.equal(item[field], undefined)
        }
      }
      const schedule = getSchedule(itemBlock, state)
      assert.ok(Number.isFinite(schedule[0].estimatedStart.getTime()))
    }
  }
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
  for (const mode of ['walking', 'driving']) {
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
