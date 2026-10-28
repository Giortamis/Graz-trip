# Graz-trip

Independent React / Vite trip planner. The itinerary covers the supplied Graz / Vienna trip on 21–24 January 2027.

## Run locally

Requires Node.js 22 or later and npm.

```sh
npm ci
npm test
npm run dev
npm run build
npm run preview
```

## Edit the itinerary

Trip metadata, notes and the reservation checklist live in `src/data/itinerary.js`. The four day files contain the activities; `places.js` holds descriptions and exact addresses, `model.js` provides data constructors, and `image-sources.json` records photo sources and attribution. Keep stable, unique IDs for days, blocks and activities. The UI and timing engine remain in `src/App.jsx`; the responsive styling is in `src/styles.css`.

- `trip`: heading, dates label, clock label and IANA time zone (`Europe/Vienna`).
- `days`: `id`, `short`, `date`, `city`, `title`.
- `blocksByDay[dayId]`: blocks with `id`, `title`, `plannedStart`, `startLabel`, `startHint`, `activities`.
- `prestartByDay[dayId]`: `title` and `text`.

Activity fields:

| Field | Meaning |
| --- | --- |
| `id` | Stable activity ID within the trip |
| `type` | `activity`, `route`, `meal`, `rest`, `free` or `fixed` |
| `typeLabel` | Optional badge override: ΔΡΑΣΗ, ΔΙΑΔΡΟΜΗ, ΓΕΥΜΑ, REST |
| `duration` | Total door-to-door minutes, including access, parking and waiting where applicable |
| `icon` | Display icon |
| `title`, `description` | Activity content |
| `origin`, `destination` | Exact Google Maps addresses; provide both for a route |
| `mode` | `walking`, `transit` or `driving` |
| `photo` | Object containing `thumb`, `full`, `alt`, optional `credit`, `source` |
| `fixedStart` | ISO timestamp with explicit UTC offset for any activity requiring a fixed anchor (including a train route) |
| `restUntil` | ISO timestamp with explicit UTC offset; REST ends no earlier than this time; `minDuration` preserves the full required rest |
| `disableNavigation` | Suppresses this activity's Maps button and automatic onward navigation on END |
| `showTimeRange` | Displays a start–end time range |
| `plannedStart`, `plannedEnd`, `scheduleLabel` | Original plan, kept visible separately from the live estimate |
| `gapBefore` | Planned gap before the activity, derived by `makeBlock` |
| `durationLabel`, `minDuration` | Display label and minimum rest duration in minutes |
| `legs` | Transport line, direction, from, to, estimate and mode |
| `stops`, `placeIds` | Place descriptions, photos, addresses and official links |
| `statuses` | Labels and tones; pending actions are never shown as booked |
| `disableAutoNavigation` | Suppresses automatic onward navigation while retaining the Maps button |
| `timeLabel`, `fixedLabel` | Optional labels for fixed events |
| `deadlineAt`, `deadlineLabel` | Optional arrival deadline and its label |
| `address` | Optional displayed address |

START records the actual block start. END stores the actual completion time and uses it as the next activity's timing basis. Fixed events retain their fixed time. REST cannot have a negative duration. END opens the next destination when applicable, preserving its origin and travel mode.

Use timestamp offsets appropriate to the travel date; Austria changes between CET and CEST. All supplied times use CET (+01:00), except the outbound 06:00 departure from Greece (+02:00). Open-ended free time and the return flight have no invented end time. Travel times are estimates, never live feeds.

## Images

`public/images/` contains 33 local photographs and their WebP thumbnails. Sources, authors and available license links are recorded in `src/data/image-sources.json` and shown with enlarged photos. Images illustrate the locations; they do not certify current weather or a reserved hotel room category. When an image is supplied, save that exact image locally. Construct both photo URLs with `import.meta.env.BASE_URL + 'images/<filename>'` so they work under the Pages subpath. Do not substitute supplied images.

## State and deployment

- localStorage: `graz-trip-live-v1`
- Repository: `Giortamis/Graz-trip`
- Vite base, PWA start URL and PWA scope: `/Graz-trip/`
- Intended Pages URL: https://giortamis.github.io/Graz-trip/
- Workflow: `.github/workflows/deploy.yml`
- GitHub Pages build source must be **GitHub Actions**.

The workflow installs the committed lockfile using `npm ci`, runs tests and the production build, uploads `dist`, and deploys with the standard GitHub Pages actions. It runs on pushes to `main` and can be dispatched manually.

This repository starts with its own Git history. The application mechanism and styles were retained from the existing travel template; no previous itinerary or destination photographs are included.

## Verified itinerary adjustments

The supplied order and time slots are retained. Tram 1 toward Prater Hauptallee replaces tram 2 for the Friday western/northern Ring route to Schwedenplatz, since tram 2 takes the eastern section after Oper. The Mausoleum is an exterior stop in January unless an interior visit is arranged. Pilgramgasse accessibility, temporary tram D diversions, train times and VAB4 are explicitly marked for rechecking before travel.

Official transport source: https://tramwm.wienerlinien.at/web/guest/fahrplaene
Winter Mausoleum source: https://www.graztourismus.at/en/sightseeing-culture/sights/mausoleum_shg_1468

No reservations are made by this app. Only the two hotel stays supplied as confirmed display BOOKED. Timed entries and restaurant bookings remain pending actions.
