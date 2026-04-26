# UIUX Studio

AI-powered UI/UX generation studio for creating complete website or mobile screen flows from natural language prompts.

The app lets users:

- start a project from a short product idea,
- generate structured screen configurations with AI,
- generate full HTML + Tailwind UI for each screen,
- apply theme systems across screens,
- iteratively edit individual screens with follow-up prompts,
- preview, drag, resize, inspect code, and export screens.

## Why This Project

Most UI generators stop at one static image. UIUX Studio focuses on **multi-screen product flows** and **editable generated output**:

- project-level generation (not only single screens),
- screen-level regeneration/edit pipeline,
- structured DB-backed project/screen persistence,
- desktop-first design canvas for practical design iteration.

## Core Features

- AI project bootstrapping from prompt + device type (website/mobile).
- AI-generated screen map with names, purposes, and layout descriptions.
- AI-generated HTML + Tailwind screen UI for each screen.
- Theme palette system with selectable theme presets.
- Regenerate specific screen sections by prompt while preserving style direction.
- Interactive canvas with pan/zoom, drag, and resize for screen frames.
- Screen actions: view source code, copy code, delete screen, download PNG.
- Clerk authentication and route protection.
- User-scoped project history sidebar.
- Neon Postgres + Drizzle ORM persistence.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Auth**: Clerk
- **Database**: Neon Postgres + Drizzle ORM
- **AI Provider**: OpenRouter SDK
- **Styling/UI**: Tailwind CSS v4, shadcn/ui, Radix UI, Lucide icons
- **Canvas/Interaction**: react-zoom-pan-pinch, react-rnd
- **Utilities**: axios, html2canvas, sonner

## Product Flow

1. User enters a product prompt on the home page.
2. App creates a project record and navigates to project workspace.
3. App calls `/api/generate-config` to generate project metadata + screen configs.
4. For each screen without code, app calls `/api/generate-screen-ui`.
5. User previews results in draggable/resizable frames on canvas.
6. User can edit specific screens through `/api/edit-screen`.
7. User can save project metadata updates (name/theme) through `/api/project` (PUT).

## Repository Structure

```text
app/
	api/
		edit-screen/          # AI-based code edits for existing screen
		generate-config/      # AI screen-map generation
		generate-screen-ui/   # AI UI code generation
		project/              # Project create/read/update
		screen/               # Screen delete
		user/                 # User bootstrap in DB
	project/[projectId]/    # Main design workspace (canvas + settings)
	_shared/                # Landing page shared sections

components/
	ui/                     # shadcn + Radix based UI primitives
	ProjectsSidebar.tsx     # User project history navigation

config/
	db.tsx                  # Drizzle db client
	openrouter.tsx          # OpenRouter client
	schema.tsx              # Drizzle table definitions

context/
	SettingContext.tsx      # Project settings state
	UserDetailContext.tsx   # Current user details state

data/
	Prompt.tsx              # AI system prompts
	themes.tsx              # Theme tokens + CSS var mapping
```

## API Endpoints

### `POST /api/user`
Creates/fetches the currently signed-in Clerk user in `users` table.

### `POST /api/project`
Creates a project shell (project id, device, user input).

### `GET /api/project`

- With `?projectId=...`: returns project details + screen configs.
- Without query param: returns all projects for signed-in user.

### `PUT /api/project`
Updates project metadata (`projectName`, `theme`).

### `POST /api/generate-config`
Generates project-level visual direction and screen configuration JSON via OpenRouter, then stores it.

### `POST /api/generate-screen-ui`
Generates HTML + Tailwind code for a specific screen and stores in `screen_config.code`.

### `POST /api/edit-screen`
Regenerates an existing screen code block based on user edit prompt and persists it.

### `DELETE /api/screen?screenId=...`
Deletes one screen from `screen_config`.

## Database Schema

### `users`

- `id` (PK)
- `name`
- `email` (unique)
- `creadits` (default 5)

### `project`

- `id` (PK)
- `projectId`
- `projectName`
- `theme`
- `userInput`
- `device`
- `createdOn`
- `config`
- `projectVisualDescription`
- `userId` (FK to `users.email`)

### `screen_config`

- `id` (PK)
- `projectId` (FK to `project.projectId`)
- `screenId`
- `screenName`
- `purpose`
- `screenDescription`
- `code`

## Environment Variables

Create a `.env.local` file in the project root.

```env
# Database
DATABASE_URL=

# OpenRouter
OPEN_ROUTER_API_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Optional Clerk route variables can be added depending on your Clerk setup.

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

- Add `.env.local` variables (see section above).
- Ensure Neon Postgres is reachable from your environment.

### 3. Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Drizzle Setup

Project already contains `drizzle.config.ts` configured for Postgres.

Typical workflow:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

Use these commands after schema updates in `config/schema.tsx`.

## UX Notes

- The main design workspace is desktop-first.
- For smaller screens (`<1024px`), the app intentionally shows a mobile advisory screen instead of the editor canvas.
- Themes are injected as CSS variables to preserve style consistency across generated screens.

## Current Limitations

- AI outputs are only as good as the prompt quality and model consistency.
- No explicit automated test suite is configured yet.
- Model/provider and prompt behavior are tightly coupled to current prompt templates.
- Some table/field names (e.g. `creadits`) contain legacy typos kept for schema compatibility.

## Suggested Next Improvements

- Add unit/integration tests for API routes and generation pipeline.
- Add project export bundle (all screens + metadata in zip).
- Add retry/backoff and richer error telemetry for AI route failures.
- Add rate-limits/usage accounting based on user credits.
- Add snapshot/version history per screen edit.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server

## License

Add your preferred license in a `LICENSE` file.
