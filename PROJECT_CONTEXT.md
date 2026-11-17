# Project: Smart Tourism Giza — Backend (Egypt-Tourist-backend)

> Paste this file at the start of every new chat. Keep the "Current status" section updated.

## What it is
Graduation project. A tourism companion for Giza (Pyramids Plateau, Nazlet El-Semman, Grand Egyptian Museum). A visitor describes a trip in Arabic or English and gets a feasible, editable single-day plan with transport options, costs and sources. Nothing (price, hour, historical claim) is shown without a source.

Backend is a **NestJS modular monolith**. Frontend is React + TypeScript + Tailwind + Leaflet (separate repo).

## Core design rules (from the SRS)
1. **Numbers come from code, not from the LLM.** Times, distances, costs are computed by the backend. The LLM only parses the user's request into structured params.
2. **Core features work without AI.** Planner and transport comparison are plain REST endpoints. The assistant is a second entry point.
3. **Provenance on every fact.** Hours, prices, fares, travel times carry: `source_id` -> DataSource, `verification_status` (verified | provisional), `last_verified_at`. Missing data = "Not available", never guessed.
4. **Verified requires a source.** Admin cannot save "Verified" without a source. Two-person check (one enters, another verifies), recorded in AuditLog.
5. **Guest-first.** No visitor registration in the MVP. Only admins sign in. Draft trip + language live in the browser.
6. **Soft delete.** Content is unpublished (`is_published`), never deleted.
7. **Bilingual fields:** `_ar` and `_en` columns; either may be empty.
8. **Units:** money `numeric(10,2)` EGP; times are local Africa/Cairo (no offset); coordinates WGS 84 (SRID 4326).

## Modules (SRS section 7)
| Module | Responsibility | Must NOT |
|---|---|---|
| Content | attractions, categories, media, aliases, search/filters, tours, content blocks | call outside services |
| Planner (#5) | constraint model, search, cost roll-up, decision log, infeasibility messages | call the LLM |
| Transport (#4) | station graph, filters, ranking + explanations, taxi estimate; single source of travel legs for the planner | guess missing data |
| Assistant (#2) | LLM adapter, JSON-schema validation, alias matching, calls Planner/Transport, rate limits, AI logs | compute times/costs/distances |
| Knowledge (#6, optional, MVP*) | ingestion, chunking, embeddings, retrieval, citations, refusal | answer from model memory |
| Auth/Admin | sign-in, roles, audit log, content workflows | expose provider keys |

## Planner algorithm (#5) — summary
- Hard constraints: opening windows + last entry, available time, budget, all must-see stops.
- Objective in order: include all must-see -> maximise interest value of nice-to-have -> minimise travel time -> minimise cost.
- Up to 8 places: exact depth-first search with pruning (labelled optimal). 9-10 places: greedy insertion + 2-opt (labelled "Good solution (heuristic)").
- Pre-check returns `infeasible` with the binding constraint and smallest fix.
- Output: schedule, totals, excluded stops with reason (TIME | BUDGET | CLOSED), decision log ("Why this plan?").
- Inputs: start point, date, start time, available time 1-12 h, optional budget EGP, visitor category (egyptian/foreign/student/child), party size 1-10, 1-10 attractions (must-see / nice-to-have), optional interests, transport preference.

## Transport ranking (#4) — summary
- Candidates: metro (Dijkstra on station graph), taxi/ride-hailing (travel estimate + tariff params), walking. Shuttles = Phase 2.
- Hard filters: budget, max time, direct-only.
- `score = w_time*t + w_cost*c + w_transfers*x` (each scaled 0 best -> 1 worst; 0 if all equal). Lowest ranks first; ties: duration, cost, transfers.
- Weights (time, cost, transfers): Cheapest 0.30/0.60/0.10 · Fastest 0.60/0.30/0.10 · Fewest transfers 0.25/0.15/0.60 · Balanced 0.40/0.40/0.20.
- Explanation sentence comes from a template. Status badge (Verified/Provisional/Estimated) never changes rank silently.

## Entities (SRS section 6.2)
- **Content:** Category, Attraction, Media (licence required), AttractionAlias, OpeningRule, TicketPrice, DataSource, ContentBlock (verified_fact | narration | tip; source required for verified_fact), Tour + TourStop (unique tour_id+stop_order), StartPreset. QuizQuestion = Phase 2.
- **Transport:** TransportNode, TransportLine, TransportLink, FareRule, TariffParameter, TravelEstimate.
- **Knowledge (only if #6):** KnowledgeDocument, KnowledgeChunk (embedding, tsvector).
- **Ops:** AdminUser (roles: administrator, content_manager), AuditLog, AiRequestLog (no message text, no IP). Phase 2: TripPlan, UserAccount/SavedTrip, Feedback.

## Roles
Guest (everything public) · Content manager (edit content, transport data, KB) · Administrator (all + manage admin accounts). Registered visitor = Phase 2.

## Current repo structure (src/)
admin, attraction, audit-logs, auth (jwt strategy, guards, refresh-token schema, DTOs), bookings, categories, database, governorates, places, routes, services, transport, users, plus empty folders: common, itineraries, maps, reviews, verification. Root: `config/` (config module + dev.env), `AGENTS.md`, vitest configs, oxlint, prettier.

## Decisions made (override the SRS)
- **Database: MongoDB (Mongoose via `@nestjs/mongoose`)**, not PostgreSQL. The SRS's PostgreSQL/PostGIS/pgvector parts map to Mongo like this:
  - `geography(Point)` -> GeoJSON `Point` + `2dsphere` index (use `$near` / `$geoNear`).
  - `tsvector` search -> text index, or a normalized-name field for Arabic search (strip diacritics, unify alef/hamza).
  - `pgvector` (only if #6 is built) -> MongoDB Atlas Vector Search.
  - FKs -> ObjectId refs; integrity (e.g. "Verified needs a source") enforced in services/validators, not by the DB.
  - "Audit entry in the same transaction" needs a replica set (Atlas has it); otherwise write the audit log right after the change and handle failure.
  - IDs are ObjectIds, not uuid.
- **Auth: JWT + refresh tokens for users** (not admin-only sessions as in the SRS). Roles guard stays: guest / user / content_manager / administrator. Keep argon2id (or bcrypt) for password hashing, and store refresh tokens hashed.

## ⚠️ Still to confirm (repo vs SRS mismatch)
Fill these in so Claude doesn't assume wrong:
- **Out-of-scope modules in repo:** `bookings`, `reviews`, `users`/register, `governorates`, `places`, `services` are not in the SRS MVP (booking/hotels were out of scope; visitor accounts = Phase 2). Keep, rename, or remove? -> `<fill in>`
- **Missing from repo vs SRS:** planner module (currently `itineraries` is empty), assistant module, opening-rules/ticket-prices/data-source entities.

## Tech facts (from the repo's AGENTS.md)
- NestJS version here is newer than most AI training data. Docs index: https://docs.nestjs.com/llms.txt (markdown page per chapter). Check first-party `@nestjs/*` packages before adding other libraries.
- **ESM project:** relative imports end in `.js`, no `__dirname` (use `import.meta.dirname`).
- **Tests run on Vitest:** use `vi.fn()`, not `jest.fn()` (the SRS says Jest, ignore that).
- Validation: `class-validator` via `ValidationPipe` still works; Standard Schema libs (Zod, Valibot, ...) via `StandardSchemaValidationPipe` are also supported.
- `ObserveModule` (NestJS Observe) is wired in `src/app.module.ts`; keys are `OBSERVE_APP_KEY` / `OBSERVE_APP_SECRET` in `.env`.

## Conventions
- One feature = one Nest module (module / controller / service / dto / entities).
- DTOs validated with class-validator + class-transformer.
- Business logic in services; controllers stay thin.
- Use Nest exceptions (NotFoundException, BadRequestException, ...).
- API docs via the OpenAPI/Swagger plugin.

## Commands
```
npm run start:dev
npm run build
npm run test          # Vitest
```

## Current status
- Working on: `<feature>`
- Done: `<...>`
- Problem / error (paste full stack trace): `<...>`
