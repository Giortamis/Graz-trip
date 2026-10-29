import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { places } from '../src/data/places.js'
import { blocksByDay } from '../src/data/itinerary.js'

const server = await createServer({
  configFile: false, root: fileURLToPath(new URL('..', import.meta.url)),
  esbuild: { jsx: 'automatic' },
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false }, appType: 'custom',
})
let PlaceActions
try {
  PlaceActions = (await server.ssrLoadModule('/src/components/PlaceActions.jsx')).default
} finally {
  await server.close()
}
const render = (place, hideMap = false) => renderToStaticMarkup(createElement(PlaceActions, { place, hideMap }))

test('missing contact details render no actions or disabled placeholders', () => {
  assert.equal(render({ name: 'Empty' }), '')
  const html = render({name:'Place',address:'Address',website:'https://example.com/'})
  assert.equal((html.match(/<a /g) || []).length, 2)
  assert.ok(!html.includes('tel:') && !html.includes('mailto:') && !html.includes('disabled'))
})

test('explicit mapUrl wins; fallback encodes the precise address', () => {
  const explicit = render({name:'Museum',address:'Ignored',mapUrl:'https://maps.google.com/?q=chosen'})
  assert.ok(explicit.includes('href="https://maps.google.com/?q=chosen"'))
  assert.ok(!explicit.includes('Ignored'))
  const address='Bürgergasse 4, Graz & Αυστρία'
  assert.ok(render({name:'Museum',address}).includes(encodeURIComponent(address)))
})

test('four actions use accessible labels and correct external / phone / email protocols', () => {
  const html=render({name:'Fixture',address:'Test only',website:'https://example.com/',
    phone:'+43 (316) 123-456',email:'fixture@example.com'})
  assert.equal((html.match(/<a /g) || []).length,4)
  assert.equal((html.match(/target="_blank"/g) || []).length,2)
  assert.equal((html.match(/rel="noreferrer"/g) || []).length,2)
  assert.equal((html.match(/<svg /g) || []).length,4)
  for (const label of ['Google Maps','Ιστοσελίδα','Κλήση','Email']) {
    assert.ok(html.includes('aria-label="'+label+': Fixture"'))
    assert.ok(html.includes('title="'+label+'"'))
  }
  assert.ok(html.includes('href="tel:+43316123456"'))
  assert.ok(html.includes('href="mailto:fixture@example.com"'))
  assert.ok(!html.includes('>Google Maps<'))
})

test('suppressed navigation cannot create a map icon, including explicit maps', () => {
  const html=render({name:'Restricted',address:'Address',mapUrl:'https://maps.google.com/',website:'https://example.com/'},true)
  assert.equal((html.match(/<a /g) || []).length,1)
  assert.ok(!html.includes('maps.google.com'))
  for(const id of ['21-airport-arrival','21-rj750','21-graz-transfer']){
    const item=Object.values(blocksByDay).flat().flatMap(b=>b.activities).find(a=>a.id===id)
    assert.equal(item.hideMaps,true,id)
  }
})

test('existing places retain their real data without invented contacts', () => {
  for(const place of Object.values(places)){
    const html=render(place)
    assert.equal((html.match(/<a /g) || []).length,2,place.id)
    assert.equal(place.phone,undefined)
    assert.equal(place.email,undefined)
  }
})

