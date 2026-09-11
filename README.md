# FlowForge AI ⚡

> Build production-grade automations using natural language.  
> 🌐 **Live App**: [https://flowforge-builder.vercel.app/](https://flowforge-builder.vercel.app/) (also available at [flowforge-hub.vercel.app](https://flowforge-hub.vercel.app/))

FlowForge AI is an autonomous visual workflow builder powered by Google Gemini and Firebase. Users can describe their automations in plain English (e.g., *"When a GitHub issue is opened, summarize details using AI, then post a notification to Discord"*), and FlowForge dynamically compiles the instructions, synthesizes interactive canvas nodes, configures connection handles, and visualizes the layout on a production-grade React Flow topology.

---

## 🛠️ Tech Stack & Architecture

* **Framework**: Next.js 16 (App Router, Turbopack, TypeScript)
* **Visual Canvas Engine**: React Flow (custom nodes, custom edges, Pan, Zoom, Minimap)
* **Backend & Security**: Firebase Auth (Google Provider), Firestore NoSQL (hierarchical workspaces, workflow documents), Cloud Storage
* **AI Model Engine**: Google Gemini 3.1 Flash Lite API (JSON-structured schema generations)
* **Styling**: TailwindCSS & Vanilla CSS (curated HSL palettes, dark modes, glassmorphism overlays)
* **Animations**: Canvas 3D Plexus particles (HTML5 constellation network)

---

## 📂 Project Directory Structure

```text
flowforge/
├── public/                 # Static assets (SVGs, brand imagery)
├── src/
│   ├── app/                # Next.js App Router Page Layouts
│   │   ├── api/            # Serverless API endpoints
│   │   │   └── ai/         # Gemini translation & assistant logs
│   │   ├── dashboard/      # Workspaces dashboard, workflow, and runs pages
│   │   ├── docs/           # Product usage documentation pages
│   │   ├── login/          # Firebase Auth sign-in / sign-up layouts
│   │   ├── icon.tsx        # Dynamic purple heartbeat logo favicon generator
│   │   ├── globals.css     # Global HSL styling system & layout classes
│   │   ├── layout.tsx      # Core viewport structure with global overlays
│   │   └── page.tsx        # Living landing page with canvas 3D Starfield
│   ├── components/         # Global shared layout components
│   │   └── ui/             # Core UI atoms (cards, badges, buttons)
│   ├── features/           # Domain-isolated logic boundaries
│   │   ├── auth/           # Context hooks & credential card elements
│   │   └── workflow/       # React Flow canvas canvas nodes, stores, panels
│   ├── lib/                # Core utilities & third-party setup
│   │   ├── firebase.ts     # Firestore, Storage, & Auth setup wrappers
│   │   └── utils.ts        # Tailwind merging & duration formatter tools
│   └── types/              # Type-safe TypeScript contract schemas
├── package.json            # Project dependencies & configurations
├── tsconfig.json           # Compiler rules
└── next.config.mjs         # Build properties configuration
```

---

## 🚀 Getting Started

### 1. Configure Credentials
Create a `.env.local` file inside the root directory and configure the environment variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Boot Up Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application locally.

---

## 👨‍💻 Created By
* **Name**: Ayush Dubey
* **University**: Madan Mohan Malaviya University of Technology
* **Portfolio**: [ayushdubey23.vercel.app](https://ayushdubey23.vercel.app/)
