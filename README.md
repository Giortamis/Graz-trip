# Graz-trip

Independent React / Vite trip planner. The current itinerary is a functional placeholder only.

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

All trip content lives in `src/data/itinerary.js`. Keep stable, unique IDs for days, blocks and activities. The UI and timing engine remain in `src/App.jsx`; the responsive styling is in `src/styles.css`.

- `trip`: heading, dates label, clock label and IANA time zone (`Europe/Vienna`).
- `days`: `id`, `short`, `date`, `city`, `title`.
- `blocksByDay[dayId]`: blocks with `id`, `title`, `plannedStart`, `startLabel`, `startHint`, `activities`.
- `prestartByDay[dayId]`: `title` and `text`.

Activity fields:

| Field | Meaning |
| --- | --- |
| `id` | Stable activity ID within the trip |
| `type` | `activity`, `route`, `meal`, `rest` or `fixed` |
| `typeLabel` | Optional badge override: ΔΡΑΣΗ, ΔΙΑΔΡΟΜΗ, ΓΕΥΜΑ, REST |
| `duration` | Total door-to-door minutes, including access, parking and waiting where applicable |
| `icon` | Display icon |
| `title`, `description` | Activity content |
| `origin`, `destination` | Exact Google Maps addresses; provide both for a route |
| `mode` | `walking` or `driving` |
| `photo` | Object containing `thumb`, `full`, `alt`, optional `credit`, `source` |
| `fixedStart` | ISO timestamp with explicit UTC offset for a `fixed` event |
| `restUntil` | ISO timestamp with explicit UTC offset; REST ends at this time |
| `disableNavigation` | Suppresses this activity's Maps button and automatic onward navigation on END |
| `showTimeRange` | Displays a start–end time range |
| `timeLabel`, `fixedLabel` | Optional labels for fixed events |
| `deadlineAt`, `deadlineLabel` | Optional arrival deadline and its label |
| `address` | Optional displayed address |

START records the actual block start. END stores the actual completion time and uses it as the next activity's timing basis. Fixed events retain their fixed time. REST cannot have a negative duration. END opens the next destination when applicable, preserving its origin and travel mode.

Use timestamp offsets appropriate to the travel date; Austria changes between CET and CEST. No travel dates have been selected yet. The placeholder has no planned start, uses zero duration solely for testing, and has no destination or photo.

## Images

`public/images/` is intentionally empty. When an image is supplied, save that exact image locally. Construct both photo URLs with `import.meta.env.BASE_URL + 'images/<filename>'` so they work under the Pages subpath. Do not substitute supplied images.

## State and deployment

- localStorage: `graz-trip-live-v1`
- Repository: `Giortamis/Graz-trip`
- Vite base, PWA start URL and PWA scope: `/Graz-trip/`
- Intended Pages URL: https://giortamis.github.io/Graz-trip/
- Workflow: `.github/workflows/deploy.yml`
- GitHub Pages build source must be **GitHub Actions**.

The workflow installs the committed lockfile using `npm ci`, runs tests and the production build, uploads `dist`, and deploys with the standard GitHub Pages actions. It runs on pushes to `main` and can be dispatched manually.

This repository starts with its own Git history. The application mechanism and styles were retained from the existing travel template; no previous itinerary or destination photographs are included.
