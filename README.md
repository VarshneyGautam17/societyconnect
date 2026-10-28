# SocietySpot (Next.js + Redux)

The React rewrite of the static SocietySpot mockup. One Next.js app (App Router), so there's
nothing separate to deploy — pages, components and state all ship together.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

## Pages
| Route | Screen |
|---|---|
| `/` | Homepage: businesses for the selected society shown first |
| `/societies` | Explore and change society |
| `/directory` | All businesses, Top Picks of the Month, filters, saved |
| `/business/[id]` | Business detail (`b1`...`b20`, or `mine`) |
| `/onboarding` | List your business: 5-step wizard, preview, publish |
| `/dashboard` | Vendor dashboard |
| `/edit` | Edit business page with a live preview |

## Structure
```
src/
  data/          static sample data (categories, societies, businesses) — the read-only "seed" data
  lib/           icon name map, dummy-photo URL builder, safe localStorage helpers
  store/         Redux Toolkit setup
    slices/      society, vendor, saved, events, enquiries
    selectors.js selectAllBusinesses / selectBusinessById / selectIsSaved
    store.js     configureStore
  components/    reusable UI (BizCard, Icon, MonoTile, Chip, Panel, PreviewCard, ...),
                 layout (Header/Footer/MobileTabBar/SiteShell), and one folder per page
                 for that page's own pieces (home/, societies/, directory/, business/,
                 onboarding/, dashboard/, edit/)
  app/           one folder per route (Next.js App Router); each page.js composes the
                 components above and owns its own page-local UI state (filters, wizard
                 step, form drafts)
```

## State: what's in Redux and why
Only the state that needs to be shared across pages/components lives in the store — everything
page-local (search text, filter toggles, wizard step, the business-edit draft) stays as plain
`useState` in the page that owns it.

- **`vendor`** — the resident's own business (`id: "mine"`). This is the one that matters most:
  `selectAllBusinesses` (in `store/selectors.js`) returns `[vendor, ...BUSINESSES]` once
  `vendor.published` is true, and the home page, directory and business-detail page all read
  through that same selector. Publishing from **Onboarding** (`publishVendor`) or saving from
  **Edit** (`setVendor`) updates this one slice, so every other page reflects it immediately —
  no page reload needed, since the Redux store (created once in `app/providers.js`) stays alive
  across client-side navigation.
- **`society`** — selected society + recently viewed, used by the header, home page and societies page.
- **`saved`** — saved business ids (heart button), used by BizCard and the directory's "Saved only" filter.
- **`events`** — view/call/WhatsApp/enquiry events, used by the dashboard's stats and activity chart.
- **`enquiries`** — messages sent from a business page's enquiry form, shown in the dashboard.

All five slices are synced to `localStorage` (see `app/providers.js`), so state survives a refresh —
same as the original static build, just centralized instead of each page reading storage separately.

## Design system
Tailwind v4, configured via `@theme` in `src/app/globals.css` (same color/radius/type tokens as the
static build) plus a few custom utilities for the organic "blob" photo frames and Material Symbols
icons. Dummy photos come from a hand-picked, visually-checked list of real Unsplash photos per
category (`src/data/categories.js`) rather than a live keyword-search image service.
