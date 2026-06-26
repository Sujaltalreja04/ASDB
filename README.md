# ADSB NavalOS – Shipyard Intelligence Platform (MVP)

ADSB NavalOS is an AI-powered enterprise shipyard intelligence application purpose-built for **Abu Dhabi Ship Building (ADSB)** — an EDGE Group company and the UAE's leading naval shipbuilder. Designed for deployment in the Mussafah Shipyard, the platform digitizes and integrates vessel program timelines, hull inspections, yard security, workforce tracking, digital twins, predictive maintenance, and operational compliance.

The interface is styled after premium defense and industrial control panels (e.g., Palantir Foundry, Honeywell Forge, Siemens Insights Hub, Anduril Lattice, and AVEVA Operations Control), using a high-performance dark theme, tactical colors, glassmorphic layouts, and responsive, interactive HTML5 Canvas visualizers.

---

## 🖥️ Project Environment & OS

*   **Primary Operating System**: Windows (fully supported and optimized).
*   **Application Framework**: React 19 + TypeScript + Vite 8.
*   **State Management**: Zustand (telemetry simulation loops ticking every 10 seconds).
*   **Styling**: TailwindCSS 4 + Custom Vanilla CSS components.
*   **Build Engine**: TypeScript compiler (`tsc`) & Vite production bundler.

---

## 🛠️ Architecture & Directory Layout

```text
asdb/
├── src/
│   ├── modules/                     # All 20 Platform Modules
│   │   ├── command-center/          # Fleet operations map, hull checklists
│   │   ├── copilot/                 # AI query command bar & auto-responses
│   │   ├── programme/               # Gantt scheduling charts & shift controls
│   │   ├── quality/                 # NDT weld & DFT paint inspection cameras
│   │   ├── safety/                  # Hazardous gas sensors & siren alarms
│   │   ├── asset-maintenance/       # Predictive RUL calibration
│   │   ├── marine-stores/           # 2D Warehouse floor layouts & RFID checks
│   │   ├── docs/                    # Monaco Editor blueprint specifications
│   │   ├── compliance/              # ISO certifications & compliance audits
│   │   ├── operations/              # API gateways & Lloyds Register connectors
│   │   ├── vision/                  # CCTV Vision AI cameras & bounding box overlays
│   │   ├── workforce/               # Welder certification renewals
│   │   ├── digital-twin/            # Isometric yard maps & ballast water pumping
│   │   ├── ar-training/             # Apprentice MTU instructions
│   │   ├── innovation-hub/          # Steel bracket nesting nesting sliders
│   │   ├── autonomous/              # Flight path waypoint canvasses
│   │   ├── ot-security/             # Purdue Level 1-3 network maps
│   │   ├── sustainability/          # Smart microgrid flow & solar offsets
│   │   ├── forecasting/             # Overtime delivery predictors
│   │   └── platform/                # Terminal-style auditor log console
│   ├── components/
│   │   ├── layout/                  # Sidebar, TopNav, AppShell navigation
│   │   └── ui/                      # Table layouts, Command Palette
│   ├── store/                       # Global Zustand telemetry stores
│   ├── types/                       # Domain TypeScript structures
│   ├── App.tsx                      # Root module routing setup
│   └── index.css                    # Design system tokens and globals
├── package.json                     # Dependency list & commands
└── tsconfig.json                    # Compiler flags
```

---

## 🚀 Installation & Usage

Follow these steps to run ADSB NavalOS locally on a Windows machine:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### 2. Install Dependencies
Open your shell (Command Prompt, PowerShell, or Bash) in the project directory and run:
```bash
npm install
```

### 3. Spin Up Development Server
To launch the application locally with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will launch on **`http://localhost:5173/`**.

### 4. Build Production Bundle
To verify TypeScript checks and compile assets for distribution:
```bash
npm run build
```
This outputs compressed static assets to the `/dist` directory.

### 5. Preview Production Build
To spin up a local server hosting the compiled production assets:
```bash
npm run preview
```

---

## 📊 Modules & Interactive Features

ADSB NavalOS contains 20 fully integrated core operational modules:

### 1. Command Center & Fleet Tracking
*   **Interactive Shipyard Map**: Zoom and click pins representing active drydocks and outfitting berths to instantly filter the active hull registries.
*   **Vessel Inspection Checklists**: Toggle compartment progress views, inspect structural welds, and review propulsion system telemetry profiles.

### 2. AI Operational Copilot
*   **Smart Query Engine**: Enter questions or click pre-defined operational chips (e.g., *"Generate Weekly Progress Report"*) to retrieve formatted tables and markdown operations briefings.

### 3. Program Management & Timelines
*   **Interactive Gantt Scheduler**: Use interactive sliders to simulate timeline accelerations or project delays, dynamically adjusting operational risk registers.

### 4. Hull Weld & Coating Quality (QA/QC)
*   **Visual Defect Overlays**: Toggle simulated CCTV feeds between Weld Porosity (NDT) and Paint DFT thickness inspections, cross-referenced with Lloyds Register rules.

### 5. Safety, HSE & Gas Telemetry
*   **Ventilation Controls**: Click switches to clear gas build-ups in drydocks. Toggling the Yard Emergency Siren displays flashing alerts and sirens.

### 6. Predictive Maintenance & Asset Management
*   **RUL Calculations**: Monitor compressor health index indicators. Pressing *Perform Calibration* resets health gauges to 99% and RUL to 180 days.

### 7. Marine Stores & Inventory
*   **2D Warehouse Grid Canvas**: Top-down view of warehouse zones. Clicking specific racks filters registry records and triggers automated Jotun paint restock orders.

### 8. Engineering Document Intelligence
*   **Monaco Code Editor**: Code, preview, and review vessel hull CAD specifications, supported by an AI assistant reference sidebar.

### 9. International Class Compliance
*   **ISO Verification Checks**: Review classification status (Lloyds/DNV) and click *Run Security Audit* to inspect welder certification logs.

### 10. Operations Integration
*   **API Gateways Dashboard**: View health stats of integrations. Clicking *Reconnect* re-establishes connections with Lloyds Register API endpoints.

### 11. CCTV Vision AI
*   **Real-time AI Overlay**: HTML5 canvas rendering workers and moving machinery. Toggle bounding box overlays (`-WORKER-` and `-CRANE-`), view temperature heatmaps, and witness real-time PPE Hard Hat Breaches.

### 12. Workforce & Skills Matrix
*   **Welder Registries**: View training statuses and click *Renew Certification* to push new validity dates into active records.

### 13. Shipyard Digital Twin
*   **Isometric Map**: Highlights selected docks. Includes drydock controls to simulate pump activations and flooding/draining water lines.

### 14. AR Apprentice Training
*   **Webcam / Camera HUD**: Captures live camera streams or falls back to simulated green grids. Direct technicians step-by-step to calibrate dampers and tighten bolt sequences in correct star-patterns.

### 15. TII Innovation Hub (R&D)
*   **Nesting Density Optimizer**: Adjust layout parameters or press *Optimize Blocks* to run nested packing algorithms that decrease steel sheet waste.

### 16. Autonomous Drone Operations
*   **Waypoint Editor**: Click directly on the drone mapping canvas to add path pins. Deploy unmanned surface vehicles (USVs) and check battery telemetry logs.

### 17. OT Cyber Security
*   **Purdue Network Map**: Interactive topology diagram showing packet transfers. Click firewall disconnect buttons to isolate compromised PLCs.

### 18. Sustainability & ESG Intelligence
*   **Solar Grid Flows Canvas**: Shows animated power currents routing energy from solar arrays and substation grids. Click buildings to toggle local Eco-Modes and recalculate daily carbon footprints.

### 19. AI Delivery Forecasting
*   **Lead-Time Modelers**: Adjust trade overtime multipliers to project vessel delivery shifts using machine learning predictors.

### 20. Platform settings & Audit Console
*   **Interactive Terminal Console**: Continuous scrolling shell showing ADSSO checks, firewalls, and network events. Change Threat Tiers (Defcons) to alter log speeds and flash system alerts.
