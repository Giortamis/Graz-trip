import { places } from './places.js'
export { places }
export const at = (day, clock) => `2027-01-${day}T${clock}:00+01:00`
export const status = (label, tone = 'warning') => ({ label, tone })
export const leg = (line, direction, from, to, estimate, mode = 'transit') => ({ line, direction, from, to, estimate, mode })
export const walk = (from, to, estimate) => leg('Περπάτημα', '', from, to, estimate, 'walking')
export const address = id => places[id]?.address || id
export const slot = (day, id, start, end, type, title, description, extra = {}) => {
  const plannedStart = at(day, start)
  const plannedEnd = end ? at(day, end) : null
  const duration = plannedEnd ? (Date.parse(plannedEnd) - Date.parse(plannedStart)) / 60000 : 0
  const defaults = { activity: ['ΔΡΑΣΗ','🏛️'], route: ['ΔΙΑΔΡΟΜΗ','🚶'], meal: ['ΓΕΥΜΑ','🍽️'], rest: ['REST','🏨'], free: ['FREE TIME','🟢'], fixed: ['ΔΡΑΣΗ','⚓'] }
  const [typeLabel, icon] = defaults[type]
  return { id: `${day}-${id}`, type, typeLabel, icon, plannedStart, plannedEnd, duration, title, description, scheduleLabel: end ? `${start}–${end}` : start, showTimeRange: Boolean(end), ...extra }
}
export const visit = (day, id, start, end, type, title, description, placeIds, extra = {}) => {
  const stops = placeIds.map(id => places[id])
  return slot(day, id, start, end, type, title, description, {
    placeIds, stops, destination: stops[0].address, mode: 'walking', photo: stops[0].photo,
    ...extra,
  })
}
export const route = (day, id, start, end, title, description, from, to, legs, extra = {}) => slot(day, id, start, end, 'route', title, description, {
  origin: address(from), destination: address(to), mode: legs.some(l => l.mode === 'transit') ? 'transit' : 'walking',
  legs, icon: legs.some(l => l.mode === 'transit') ? '🚋' : '🚶', category: 'transport', ...extra,
})
export const makeBlock = (id, title, activities, startHint) => {
  let previous = null
  const normalized = activities.map(activity => {
    const gapBefore = previous ? Math.max(0, (Date.parse(activity.plannedStart) - Date.parse(previous.plannedEnd || previous.plannedStart)) / 60000) : 0
    const result = { ...activity, gapBefore }
    if (!result.origin && result.destination && previous?.destination && previous.destination !== result.destination) result.origin = previous.destination
    previous = activity
    return result
  })
  return { id, title, plannedStart: activities[0].plannedStart, startLabel: '▶ START', startHint, activities: normalized }
}
export const transportSource = 'https://tramwm.wienerlinien.at/web/guest/fahrplaene'
export const grazSource = 'https://www.holding-graz.at/de/mobilitaet/linien/linienfahrplaene/'
export const BUS_STOP = 'Margaretenplatz, Schönbrunner Straße, 1050 Wien'
export const OPER = 'Oper, Karlsplatz, 1010 Wien'
export const KARLS = 'Karlsplatz U-Bahn, 1040 Wien'
export const SCHWEDEN = 'Schwedenplatz, 1010 Wien'
export const JAKO = 'Jakominiplatz, 8010 Graz'
export const STADIUM_STOP = 'Stadion Liebenau/Bertha-von-Suttner-Platz, Graz'
export const LIFT = 'Schlossberglift, Schloßbergplatz, 8010 Graz'


