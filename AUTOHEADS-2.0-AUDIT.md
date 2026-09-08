# Autoheads 2.0 — Phase 1 audit and recommendation

Audit date: 8 September 2026

## Executive finding

The redesign repository is a source-backed public-content migration, not the original Autoheads application. It contains the public vehicle, directory and editorial information audited from `autoheads.co.zw`, but it does not contain the original database, private users, authenticated administration system, reviews, payments, advertising records or hosting credentials. Those systems cannot be truthfully retained or assessed from this checkout alone; an authorised export or access to the original application is required.

| Component | Recommendation | Reason |
|---|---|---|
| Vehicle makes and models | Retain / improve | 28 makes and 41 source model guides are accessible through make and model routes. Enrich only from verified source records. |
| Vehicle imagery | Improve | Existing responsive Next.js image delivery is retained. Create thumbnail, listing and hero variants as the library grows. |
| Spares directory | Retain / improve | 62 public supplier records, 46 categories and contact data have been migrated. Pagination, location and category filtering now protect mobile performance. |
| Workshop directory | Retain / improve | 100 public workshop records and 36 service categories have been migrated. Preserve the distinction between workshops and individual mechanics. |
| Mechanics | Retain / improve | Six public mechanic records and 12 categories are present. |
| Business profiles | Improve | Public name, services, address and phone data are retained. Call, WhatsApp and directions are surfaced without inventing email, opening hours or ratings. |
| Motoring content | Retain / improve | Six source motoring tips and two news posts are present. Future editing should use a structured CMS or database. |
| Global search | Rebuild when database returns | Current snapshot search is appropriate for the small static data set. Growing production data needs indexed server-side search, grouped results, caching and pagination. |
| Autoheads Verified | Foundation now | A neutral public explanation and listing-state model exist. No provider is marked verified before Autoheads defines its policy and authorised staff complete reviews. |
| Commercial placements | Foundation now | Typed placement and campaign states exist with no hardcoded sponsors, prices or advertisements. A database-backed admin workflow is required before activation. |
| Lead tracking | Foundation now | Contact controls identify call, WhatsApp and directions actions. Persistent event recording must wait for an approved privacy policy, analytics destination and consent rules. |
| Accounts and authentication | Audit with original system | The public screens are present, but this repository has no original user store or authentication backend. Do not launch account workflows until password handling, roles and migration are audited. |
| Administration | Rebuild after authorised audit | No private admin source or database was supplied. Required future areas are businesses, categories, locations, vehicles, editorial, applications, verification, commercial campaigns and leads. |
| SEO | Retain / improve | Existing public route shapes are preserved where possible. Sitemap, robots and indexable server-rendered pages are included. Add production-domain canonicals when the final Autoheads domain is connected. |
| Legacy or unused plugins | Review, then remove | The original dependency inventory is unavailable. Nothing should be deleted until the authorised codebase and integrations are inspected. |

## Phase 1 delivered in this repository

- FIND: global search, make/model browsing, directory search, categories, locations and pagination.
- TRUST: source attribution, truthful listing states and the Autoheads Verified foundation without false badges.
- KNOW: vehicle guides, motoring tips, news and related supplier actions.
- CONNECT: prominent call, WhatsApp and directions actions where source contact data exists.
- COMMERCIAL READINESS: reusable listing-plan and placement models, with an intentionally empty campaign store.
- PERFORMANCE: paginated directory rendering, deferred search input, responsive images, reduced-motion handling and limited above-the-fold image priority.
- SEO: preserved public routes, XML sitemap and robots policy.

## Required inputs for the next authorised stage

1. Original application source and dependency inventory.
2. Read-only production database schema/export, excluding secrets.
3. Authorised admin access and role map.
4. Current hosting, domain, email, maps, analytics and payment integration inventory.
5. Autoheads verification policy and responsible staff roles.
6. Approved privacy, consent and lead-retention rules.
7. Commercial package definitions and pricing supplied by Autoheads.

No private data, prices, verified businesses, reviews, sponsors or administrative claims have been invented.
