import {
  Vessel,
  MaintenanceAsset,
  Permit,
  NCR,
  Employee,
  InventoryItem,
  ComplianceRecord,
  ESGMetric,
  Workspace,
  Alert,
  SafetyEvent,
  EnvironmentalReading
} from '../../types/adsb';

// === WORKSPACES ===
export const mockWorkspaces: Workspace[] = [
  {
    id: 'mussafah',
    name: 'Mussafah Shipyard',
    shortName: 'Mussafah Yard',
    description: 'Main shipyard, Abu Dhabi (Steel fabrication, Block assembly, Outfitting & Construction)',
    location: 'Mussafah Industrial Area, Abu Dhabi, UAE',
    programme: 'UAE',
    activeVessels: 8,
    personnel: 642,
    alertCount: 4,
    status: 'Active',
    coordinates: { lat: 24.3601, lng: 54.4984 },
    icon: 'Ship'
  },
  {
    id: 'minazayed',
    name: 'Mina Zayed Dry Dock',
    shortName: 'Mina Zayed',
    description: 'Floating dry dock facility for marine repair and refit operations',
    location: 'Mina Zayed Port, Abu Dhabi, UAE',
    programme: 'Commercial',
    activeVessels: 3,
    personnel: 124,
    alertCount: 1,
    status: 'Active',
    coordinates: { lat: 24.5204, lng: 54.3853 },
    icon: 'Anchor'
  },
  {
    id: 'kuwait-falaj3',
    name: 'Kuwait Programme – Falaj 3',
    shortName: 'Kuwait Prog',
    description: 'Al-Dorra-class 62m missile boat programme (8 vessels for Kuwait Ministry of Defence)',
    location: 'Mussafah Yard / Kuwait Naval Base',
    programme: 'Kuwait',
    activeVessels: 8,
    personnel: 245,
    alertCount: 2,
    status: 'Active',
    icon: 'ShieldAlert'
  },
  {
    id: 'angola-br71',
    name: 'Angola Programme – BR71 MKII',
    shortName: 'Angola Prog',
    description: 'Combattante-class 71m corvette programme (3 vessels for Angolan Navy)',
    location: 'Mussafah Yard / CMN Naval France',
    programme: 'Angola',
    activeVessels: 3,
    personnel: 180,
    alertCount: 3,
    status: 'Active',
    icon: 'ShieldAlert'
  },
  {
    id: 'uae-navy',
    name: 'UAE Navy – Falaj 3',
    shortName: 'UAE Navy F3',
    description: 'Ongoing Falaj 3-class offshore patrol vessels and refit contracts for UAE Navy',
    location: 'Mussafah Yard / Abu Dhabi Naval Base',
    programme: 'UAE',
    activeVessels: 2,
    personnel: 150,
    alertCount: 0,
    status: 'Active',
    icon: 'Shield'
  },
  {
    id: 'edge-corporate',
    name: 'Corporate / EDGE Group',
    shortName: 'EDGE Group',
    description: 'Group-level executive oversight and consolidation dashboard',
    location: 'EDGE Group HQ, Abu Dhabi',
    programme: 'EdgeGroup',
    activeVessels: 25,
    personnel: 1420,
    alertCount: 10,
    status: 'Active',
    icon: 'Building'
  }
];

// === VESSELS ===
export const mockVessels: Vessel[] = [
  {
    id: 'hn301',
    hullNumber: 'HN-301',
    name: 'AL NOUKHITHA',
    vesselClass: 'Al-Dorra',
    programme: 'Kuwait',
    customer: 'Kuwait Ministry of Defence',
    lengthMetres: 62,
    currentPhase: 'SteelFabrication',
    completionPercent: 34,
    scheduleAdherenceDays: -6,
    location: 'Bay1',
    buildBay: 'Build Bay 1',
    spi: 0.94,
    cpi: 0.97,
    budgetUSD: 45000000,
    actualCostUSD: 15800000,
    contractDate: '2025-01-15',
    targetDelivery: '2027-06-30',
    forecastDelivery: '2027-07-06',
    classSociety: ['LloydRegister'],
    flagState: 'Kuwait Navy',
    propulsion: '4x MTU 16V 4000 M93L, Kongsberg Kamewa S63-4',
    ncrsOpen: 4,
    qualityScore: 92.5,
    lastUpdated: '2026-06-26T14:30:00Z',
    milestones: [
      { id: 'm1', name: 'Contract Award', phase: 'Contract', plannedDate: '2025-01-15', forecastDate: '2025-01-15', actualDate: '2025-01-15', status: 'Completed' },
      { id: 'm2', name: 'Design Freeze', phase: 'Design', plannedDate: '2025-06-10', forecastDate: '2025-06-10', actualDate: '2025-06-12', status: 'Completed' },
      { id: 'm3', name: 'Steel Cutting', phase: 'SteelCutting', plannedDate: '2025-10-01', forecastDate: '2025-10-01', actualDate: '2025-09-28', status: 'Completed' },
      { id: 'm4', name: 'Block Erection', phase: 'BlockAssembly', plannedDate: '2026-04-15', forecastDate: '2026-05-01', status: 'Delayed' },
      { id: 'm5', name: 'Vessel Launch', phase: 'Launch', plannedDate: '2026-11-20', forecastDate: '2026-11-28', status: 'Upcoming' },
      { id: 'm6', name: 'Sea Trials', phase: 'SeaTrials', plannedDate: '2027-04-01', forecastDate: '2027-04-10', status: 'Upcoming' },
      { id: 'm7', name: 'Delivery', phase: 'Delivery', plannedDate: '2027-06-30', forecastDate: '2027-07-06', status: 'Upcoming' }
    ]
  },
  {
    id: 'hn302',
    hullNumber: 'HN-302',
    name: 'AL DORRA',
    vesselClass: 'Al-Dorra',
    programme: 'Kuwait',
    customer: 'Kuwait Ministry of Defence',
    lengthMetres: 62,
    currentPhase: 'Design',
    completionPercent: 8,
    scheduleAdherenceDays: 0,
    location: 'Offices',
    spi: 1.0,
    cpi: 1.0,
    budgetUSD: 45000000,
    actualCostUSD: 3600000,
    contractDate: '2025-01-15',
    targetDelivery: '2027-12-31',
    forecastDelivery: '2027-12-31',
    classSociety: ['LloydRegister'],
    flagState: 'Kuwait Navy',
    propulsion: '4x MTU 16V 4000 M93L, Kongsberg Kamewa S63-4',
    ncrsOpen: 0,
    qualityScore: 100,
    lastUpdated: '2026-06-25T11:00:00Z',
    milestones: [
      { id: 'm201', name: 'Contract Award', phase: 'Contract', plannedDate: '2025-01-15', forecastDate: '2025-01-15', actualDate: '2025-01-15', status: 'Completed' },
      { id: 'm202', name: 'Design Freeze', phase: 'Design', plannedDate: '2026-07-15', forecastDate: '2026-07-15', status: 'InProgress' },
      { id: 'm203', name: 'Steel Cutting', phase: 'SteelCutting', plannedDate: '2026-10-10', forecastDate: '2026-10-10', status: 'Upcoming' }
    ]
  },
  {
    id: 'hn201',
    hullNumber: 'HN-201',
    name: 'M\'BANZA CONGO',
    vesselClass: 'BR71-MKII',
    programme: 'Angola',
    customer: 'Angolan Navy',
    lengthMetres: 71,
    currentPhase: 'Outfitting',
    completionPercent: 61,
    scheduleAdherenceDays: -3,
    location: 'CMN Naval France',
    spi: 0.98,
    cpi: 0.95,
    budgetUSD: 65000000,
    actualCostUSD: 42100000,
    contractDate: '2024-04-10',
    targetDelivery: '2027-01-15',
    forecastDelivery: '2027-01-18',
    classSociety: ['BureauVeritas'],
    flagState: 'Angola Navy',
    propulsion: '4x MTU engine systems, CPP propulsion',
    ncrsOpen: 7,
    qualityScore: 89.2,
    lastUpdated: '2026-06-26T10:15:00Z',
    milestones: [
      { id: 'm301', name: 'Steel Cutting', phase: 'SteelCutting', plannedDate: '2024-08-01', forecastDate: '2024-08-01', actualDate: '2024-08-01', status: 'Completed' },
      { id: 'm302', name: 'Keel Laying', phase: 'BlockAssembly', plannedDate: '2024-12-05', forecastDate: '2024-12-05', actualDate: '2024-12-08', status: 'Completed' },
      { id: 'm303', name: 'Launch', phase: 'Launch', plannedDate: '2025-10-20', forecastDate: '2025-10-20', actualDate: '2025-10-25', status: 'Completed' },
      { id: 'm304', name: 'Sea Trials', phase: 'SeaTrials', plannedDate: '2026-09-01', forecastDate: '2026-09-05', status: 'Upcoming' }
    ]
  },
  {
    id: 'hn202',
    hullNumber: 'HN-202',
    name: 'NIMBA',
    vesselClass: 'BR71-MKII',
    programme: 'Angola',
    customer: 'Angolan Navy',
    lengthMetres: 71,
    currentPhase: 'BlockAssembly',
    completionPercent: 22,
    scheduleAdherenceDays: 2,
    location: 'Bay2',
    buildBay: 'Build Bay 2',
    spi: 1.02,
    cpi: 0.99,
    budgetUSD: 65000000,
    actualCostUSD: 14500000,
    contractDate: '2024-04-10',
    targetDelivery: '2027-08-30',
    forecastDelivery: '2027-08-28',
    classSociety: ['BureauVeritas'],
    flagState: 'Angola Navy',
    propulsion: '4x MTU engine systems, CPP propulsion',
    ncrsOpen: 3,
    qualityScore: 94.1,
    lastUpdated: '2026-06-26T13:00:00Z',
    milestones: [
      { id: 'm401', name: 'Steel Cutting', phase: 'SteelCutting', plannedDate: '2025-05-15', forecastDate: '2025-05-15', actualDate: '2025-05-14', status: 'Completed' },
      { id: 'm402', name: 'Keel Laying', phase: 'BlockAssembly', plannedDate: '2025-11-10', forecastDate: '2025-11-10', actualDate: '2025-11-10', status: 'Completed' }
    ]
  },
  {
    id: 'hn101',
    hullNumber: 'HN-101',
    name: 'FALAJ 3 UAE',
    vesselClass: 'Falaj-3',
    programme: 'UAE',
    customer: 'UAE Armed Forces / UAE Navy',
    lengthMetres: 60,
    currentPhase: 'SeaTrials',
    completionPercent: 96,
    scheduleAdherenceDays: 5,
    location: 'Quayside',
    buildBay: 'Outfitting Wharf 1',
    spi: 1.04,
    cpi: 1.01,
    budgetUSD: 42000000,
    actualCostUSD: 40500000,
    contractDate: '2023-02-18',
    targetDelivery: '2026-08-30',
    forecastDelivery: '2026-08-25',
    classSociety: ['LloydRegister', 'TASNEEF'],
    flagState: 'UAE Navy',
    propulsion: '4x MTU 16V 4000, Waterjet Propulsion',
    ncrsOpen: 1,
    qualityScore: 96.8,
    lastUpdated: '2026-06-26T15:20:00Z',
    milestones: [
      { id: 'm501', name: 'Keel Laying', phase: 'BlockAssembly', plannedDate: '2023-11-05', forecastDate: '2023-11-05', actualDate: '2023-11-05', status: 'Completed' },
      { id: 'm502', name: 'Launch', phase: 'Launch', plannedDate: '2025-03-22', forecastDate: '2025-03-22', actualDate: '2025-03-20', status: 'Completed' },
      { id: 'm503', name: 'Sea Trials Phase 1', phase: 'SeaTrials', plannedDate: '2026-05-10', forecastDate: '2026-05-10', actualDate: '2026-05-12', status: 'Completed' },
      { id: 'm504', name: 'Final Handover', phase: 'Delivery', plannedDate: '2026-08-30', forecastDate: '2026-08-25', status: 'InProgress' }
    ]
  },
  {
    id: 'fa400',
    hullNumber: 'FA-400',
    name: 'FA-400 PROTOTYPE',
    vesselClass: 'FA-400',
    programme: 'UAE',
    customer: 'EDGE Group / ADSB R&D',
    lengthMetres: 45,
    currentPhase: 'Design',
    completionPercent: 12,
    scheduleAdherenceDays: 0,
    location: 'Offices',
    spi: 1.0,
    cpi: 0.98,
    budgetUSD: 18000000,
    actualCostUSD: 2100000,
    contractDate: '2025-10-12',
    targetDelivery: '2028-03-15',
    forecastDelivery: '2028-03-15',
    classSociety: ['TASNEEF'],
    flagState: 'UAE OPV Research',
    propulsion: 'Hybrid Electric-Diesel, Dual Kamewa jets',
    ncrsOpen: 0,
    qualityScore: 98.0,
    lastUpdated: '2026-06-20T08:00:00Z',
    milestones: [
      { id: 'm601', name: 'Concept Formulation', phase: 'Contract', plannedDate: '2025-10-12', forecastDate: '2025-10-12', actualDate: '2025-10-12', status: 'Completed' },
      { id: 'm602', name: 'Preliminary Design Review', phase: 'Design', plannedDate: '2026-08-01', forecastDate: '2026-08-01', status: 'InProgress' }
    ]
  }
];

// Add hulls HN-303 through HN-308 for Kuwait programme to satisfy complete set
for (let i = 3; i <= 8; i++) {
  mockVessels.push({
    id: `hn30${i}`,
    hullNumber: `HN-30${i}`,
    name: `HN-30${i} (TBD)`,
    vesselClass: 'Al-Dorra',
    programme: 'Kuwait',
    customer: 'Kuwait Ministry of Defence',
    lengthMetres: 62,
    currentPhase: 'Contract',
    completionPercent: 0,
    scheduleAdherenceDays: 0,
    location: 'Offices',
    spi: 1.0,
    cpi: 1.0,
    budgetUSD: 45000000,
    actualCostUSD: 0,
    contractDate: '2025-01-15',
    targetDelivery: `2028-06-30`,
    forecastDelivery: `2028-06-30`,
    classSociety: ['LloydRegister'],
    flagState: 'Kuwait Navy',
    propulsion: '4x MTU 16V 4000 M93L, Kongsberg Kamewa S63-4',
    ncrsOpen: 0,
    qualityScore: 100.0,
    lastUpdated: '2026-06-01T00:00:00Z',
    milestones: [
      { id: `m${i}01`, name: 'Contract Award', phase: 'Contract', plannedDate: '2025-01-15', forecastDate: '2025-01-15', actualDate: '2025-01-15', status: 'Completed' }
    ]
  });
}

// === EQUIPMENT / ASSETS ===
export const mockAssets: MaintenanceAsset[] = [
  {
    id: 'gc01',
    assetId: 'GC-01',
    name: 'Gantry Crane 250T North',
    category: 'Gantry Crane',
    location: 'Bay1',
    status: 'Operational',
    healthScore: 94,
    rul: 124,
    failureProbability7d: 0.01,
    failureProbability14d: 0.02,
    failureProbability30d: 0.05,
    lastMaintenance: '2026-05-12',
    nextMaintenance: '2026-08-12',
    totalOperatingHours: 4210,
    specifications: { capacity: '250 Tonnes', manufacturer: 'Konecranes', span: '65m', hoistSpeed: '4m/min' },
    openWorkOrders: 0,
    anomalies: [],
    sensors: [
      { id: 'gc01_load', name: 'Hoist Load', value: 85.4, unit: 'T', min: 0, max: 250, warningThreshold: 220, criticalThreshold: 245, status: 'Normal', trend: [10, 30, 50, 85.4, 85.4, 85.4, 0, 0, 12, 45, 98, 85.4] },
      { id: 'gc01_vib', name: 'Main Gearbox Vibration', value: 1.8, unit: 'mm/s', min: 0, max: 10, warningThreshold: 4.5, criticalThreshold: 7.0, status: 'Normal', trend: [1.6, 1.7, 1.8, 1.7, 1.8, 1.9, 1.8, 1.8, 1.7, 1.8, 1.8, 1.8] },
      { id: 'gc01_temp', name: 'Hoist Motor Temp', value: 68.2, unit: '°C', min: 20, max: 120, warningThreshold: 90, criticalThreshold: 105, status: 'Normal', trend: [40, 55, 62, 65, 68, 68.2, 68, 62, 50, 42, 40, 68.2] }
    ]
  },
  {
    id: 'gc02',
    assetId: 'GC-02',
    name: 'Gantry Crane 250T South',
    category: 'Gantry Crane',
    location: 'Bay2',
    status: 'Operational',
    healthScore: 88,
    rul: 82,
    failureProbability7d: 0.02,
    failureProbability14d: 0.06,
    failureProbability30d: 0.12,
    lastMaintenance: '2026-04-18',
    nextMaintenance: '2026-07-18',
    totalOperatingHours: 4890,
    specifications: { capacity: '250 Tonnes', manufacturer: 'Konecranes', span: '65m', hoistSpeed: '4m/min' },
    openWorkOrders: 1,
    anomalies: ['Brake rotor heat signature higher than nominal'],
    sensors: [
      { id: 'gc02_load', name: 'Hoist Load', value: 142.1, unit: 'T', min: 0, max: 250, warningThreshold: 220, criticalThreshold: 245, status: 'Normal', trend: [100, 120, 142.1, 142.1, 0, 0, 0, 50, 120, 142.1] },
      { id: 'gc02_temp', name: 'Hoist Brake Temp', value: 89.5, unit: '°C', min: 20, max: 140, warningThreshold: 95, criticalThreshold: 115, status: 'Warning', trend: [70, 78, 85, 89.5, 91.2, 89.5, 88.0, 70, 65, 89.5] }
    ]
  },
  {
    id: 'gc03',
    assetId: 'GC-03',
    name: 'Jib Crane 100T Outfitting',
    category: 'Gantry Crane',
    location: 'Outfitting',
    status: 'Operational',
    healthScore: 91,
    rul: 145,
    failureProbability7d: 0.01,
    failureProbability14d: 0.02,
    failureProbability30d: 0.04,
    lastMaintenance: '2026-05-28',
    nextMaintenance: '2026-08-28',
    totalOperatingHours: 2100,
    specifications: { capacity: '100 Tonnes', manufacturer: 'Liebherr', outreach: '42m' },
    openWorkOrders: 0,
    anomalies: [],
    sensors: [
      { id: 'gc03_load', name: 'Hoist Load', value: 24.5, unit: 'T', min: 0, max: 100, warningThreshold: 85, criticalThreshold: 95, status: 'Normal', trend: [10, 20, 24.5, 24.5, 0, 0, 5, 24.5] }
    ]
  },
  {
    id: 'gc04',
    assetId: 'GC-04',
    name: 'Yard Mobile Crane 50T',
    category: 'Gantry Crane',
    location: 'Quayside',
    status: 'Maintenance',
    healthScore: 42,
    rul: 12,
    failureProbability7d: 0.65,
    failureProbability14d: 0.85,
    failureProbability30d: 0.98,
    lastMaintenance: '2026-02-10',
    nextMaintenance: '2026-06-26',
    totalOperatingHours: 6700,
    specifications: { capacity: '50 Tonnes', manufacturer: 'Tadano', type: 'All-Terrain Mobile' },
    openWorkOrders: 1,
    anomalies: ['Hydraulic pressure leak in main outrigger system'],
    sensors: [
      { id: 'gc04_hyd', name: 'Hydraulic Pressure', value: 160.0, unit: 'Bar', min: 0, max: 350, warningThreshold: 180, criticalThreshold: 150, status: 'Critical', trend: [240, 230, 210, 190, 180, 175, 170, 168, 162, 160.0] }
    ]
  },
  {
    id: 'pl01',
    assetId: 'PL-01',
    name: 'Automated Steel Panel Line',
    category: 'Panel Line',
    location: 'SteelFab',
    status: 'Operational',
    healthScore: 96,
    rul: 220,
    failureProbability7d: 0.005,
    failureProbability14d: 0.01,
    failureProbability30d: 0.03,
    lastMaintenance: '2026-06-01',
    nextMaintenance: '2026-09-01',
    totalOperatingHours: 12450,
    specifications: { manufacturer: 'PEMA', maxWidth: '16m', weldProcess: 'Submerged Arc (SAW)' },
    openWorkOrders: 0,
    anomalies: [],
    sensors: [
      { id: 'pl01_feed', name: 'Feed Rate', value: 1.2, unit: 'm/min', min: 0, max: 3, warningThreshold: 2.5, criticalThreshold: 2.8, status: 'Normal', trend: [1.2, 1.2, 1.2, 1.2, 0, 0, 1.2, 1.2] },
      { id: 'pl01_gas', name: 'Weld Gas Flow', value: 24.1, unit: 'L/min', min: 0, max: 50, warningThreshold: 15, criticalThreshold: 10, status: 'Normal', trend: [24.0, 24.2, 24.1, 24.1, 24.1, 0, 0, 24.1] }
    ]
  },
  {
    id: 'pct01',
    assetId: 'PCT-01',
    name: 'Plasma Cutting Table Heavy Duty',
    category: 'Plasma Cutter',
    location: 'SteelFab',
    status: 'Operational',
    healthScore: 89,
    rul: 60,
    failureProbability7d: 0.03,
    failureProbability14d: 0.08,
    failureProbability30d: 0.18,
    lastMaintenance: '2026-05-15',
    nextMaintenance: '2026-07-15',
    totalOperatingHours: 8520,
    specifications: { size: '4.5m x 18m', headCount: '2x Plasma, 1x Oxy', gasType: 'Argon/N2' },
    openWorkOrders: 0,
    anomalies: [],
    sensors: [
      { id: 'pct01_nozzle', name: 'Nozzle Electrode Wear', value: 72.4, unit: '%', min: 0, max: 100, warningThreshold: 80, criticalThreshold: 92, status: 'Normal', trend: [60, 62, 65, 68, 70, 71.5, 72.4] }
    ]
  },
  {
    id: 'sbs02',
    assetId: 'SBS-02',
    name: 'Automated Sandblasting Booth B2',
    category: 'Sandblasting',
    location: 'Blasting',
    status: 'Fault',
    healthScore: 15,
    rul: 2,
    failureProbability7d: 0.95,
    failureProbability14d: 0.99,
    failureProbability30d: 1.0,
    lastMaintenance: '2026-03-20',
    nextMaintenance: '2026-06-20',
    totalOperatingHours: 3200,
    specifications: { compressor: 'Ingersoll Rand', capacity: '12m3/min', nozzleDiameter: '12.5mm' },
    openWorkOrders: 1,
    anomalies: ['Air intake pressure drops below critical limits', 'SBS-02 downtime exceeds 72 hours'],
    sensors: [
      { id: 'sbs02_press', name: 'Air Discharge Pressure', value: 3.2, unit: 'Bar', min: 0, max: 12, warningThreshold: 6.5, criticalThreshold: 5.0, status: 'Critical', trend: [8.5, 8.2, 7.9, 7.1, 6.2, 5.0, 4.2, 3.5, 3.2] }
    ]
  },
  {
    id: 'pc01',
    assetId: 'PC-01',
    name: 'Climate Painting Chamber Large',
    category: 'Painting Chamber',
    location: 'Painting',
    status: 'Operational',
    healthScore: 92,
    rul: 110,
    failureProbability7d: 0.01,
    failureProbability14d: 0.03,
    failureProbability30d: 0.07,
    lastMaintenance: '2026-05-02',
    nextMaintenance: '2026-08-02',
    totalOperatingHours: 5120,
    specifications: { dimensions: '75m x 18m x 15m', airflow: '120,000 m3/h', heatingTemp: '60°C max' },
    openWorkOrders: 0,
    anomalies: ['RH exceeded 85% for 3 consecutive days'],
    sensors: [
      { id: 'pc01_temp', name: 'Chamber Temp', value: 28.5, unit: '°C', min: 10, max: 60, warningThreshold: 45, criticalThreshold: 55, status: 'Normal', trend: [24, 25, 27, 28, 28.5, 29, 28.5, 28, 27] },
      { id: 'pc01_rh', name: 'Relative Humidity', value: 86.4, unit: '%', min: 10, max: 100, warningThreshold: 80, criticalThreshold: 85, status: 'Critical', trend: [78, 81, 84, 85.1, 86.2, 86.4, 86.4, 86.4, 86.4] }
    ]
  },
  {
    id: 'fdd01',
    assetId: 'FDD-01',
    name: 'Mina Zayed Floating Dry Dock',
    category: 'Floating Dry Dock',
    location: 'Mina Zayed',
    status: 'Operational',
    healthScore: 95,
    rul: 340,
    failureProbability7d: 0.001,
    failureProbability14d: 0.003,
    failureProbability30d: 0.01,
    lastMaintenance: '2026-01-10',
    nextMaintenance: '2026-07-10',
    totalOperatingHours: 24100,
    specifications: { liftingCapacity: '8,000 Tonnes', length: '125m', innerWidth: '22.5m', pumps: '4x 220kW ballast pumps' },
    openWorkOrders: 0,
    anomalies: [],
    sensors: [
      { id: 'fdd01_tilt_x', name: 'Trim Angle', value: 0.05, unit: '°', min: -2, max: 2, warningThreshold: 0.5, criticalThreshold: 1.0, status: 'Normal', trend: [0.01, 0.02, 0.04, 0.05] },
      { id: 'fdd01_tilt_y', name: 'Heel Angle', value: -0.02, unit: '°', min: -2, max: 2, warningThreshold: 0.5, criticalThreshold: 1.0, status: 'Normal', trend: [0.00, -0.01, -0.01, -0.02] }
    ]
  }
];

// === ALERTS ===
export const mockAlerts: Alert[] = [
  {
    id: 'alt01',
    title: 'Downtime Alert: SBS-02 Out of Service',
    description: 'Sandblasting system SBS-02 downtime has exceeded 72 hours. Structural block assembly for HN-301 is tracking 6 days behind schedule due to steel surface preparation constraints. Recommend expediting repair.',
    severity: 'critical',
    category: 'Maintenance',
    zone: 'Blasting',
    vesselId: 'hn301',
    hullNumber: 'HN-301',
    assetId: 'SBS-02',
    timestamp: '2026-06-26T08:15:00Z',
    isRead: false,
    isAcknowledged: false,
    source: 'Asset Intelligence API',
    actions: [
      { label: 'View Asset Health', type: 'primary', href: '/asset-maintenance' },
      { label: 'Create Urg Work Order', type: 'secondary' }
    ]
  },
  {
    id: 'alt02',
    title: 'Weld Qualification Expiring: WQ-47',
    description: 'Welder qualification record WQ-47 (SMAW, 6G position, DH36 grade steel) expires in 14 days. There are 3 active weld joints on HN-301 requiring this certification. Supervisor action required.',
    severity: 'warning',
    category: 'Compliance',
    zone: 'Bay1',
    vesselId: 'hn301',
    hullNumber: 'HN-301',
    timestamp: '2026-06-26T10:30:00Z',
    isRead: false,
    isAcknowledged: false,
    source: 'Workforce Compliance Engine',
    actions: [
      { label: 'View Welder Profile', type: 'primary' },
      { label: 'Schedule Renewal', type: 'secondary' }
    ]
  },
  {
    id: 'alt03',
    title: 'High Humidity Warning: PC-01 Paint Chamber',
    description: 'Relative humidity in Paint Booth PC-01 exceeded 85% RH for 3 consecutive days. High risk of coating cure failure on recently applied Jotun SeaForce antifouling system. Recommend paint application hold.',
    severity: 'warning',
    category: 'Quality',
    zone: 'Painting',
    vesselId: 'hn101',
    hullNumber: 'HN-101',
    assetId: 'PC-01',
    timestamp: '2026-06-26T12:00:00Z',
    isRead: false,
    isAcknowledged: false,
    source: 'SCADA Climate Controller',
    actions: [
      { label: 'Environmental Controls', type: 'primary' },
      { label: 'Register Inspection Hold', type: 'secondary' }
    ]
  },
  {
    id: 'alt04',
    title: 'SIMOPS Limit Warning: Confined Space Engine Room',
    description: 'Zone B3 (HN-301 Engine Room) currently has 4 simultaneous hot work operations active under separate permits. Maximum SIMOPS limit is 5. Risk index elevated. Safety watch posted.',
    severity: 'warning',
    category: 'Safety',
    zone: 'Bay1',
    vesselId: 'hn301',
    hullNumber: 'HN-301',
    timestamp: '2026-06-26T14:45:00Z',
    isRead: false,
    isAcknowledged: false,
    source: 'Live Permit-to-Work Dashboard',
    actions: [
      { label: 'Inspect Permits', type: 'primary' },
      { label: 'Inspect Area CCTV', type: 'secondary' }
    ]
  },
  {
    id: 'alt05',
    title: 'Intrusion Alert: Armed Restricted Area Perimeter',
    description: 'Unauthorised badge scan attempt at UAE OPV HN-101 Combat Management Switchroom (Classified clearance tier 6 required). Person identified: Sub-contractor tradesperson.',
    severity: 'critical',
    category: 'Security',
    zone: 'Quayside',
    vesselId: 'hn101',
    hullNumber: 'HN-101',
    timestamp: '2026-06-26T16:10:00Z',
    isRead: false,
    isAcknowledged: false,
    source: 'Access Control Security System',
    actions: [
      { label: 'Trigger Security Lockdown', type: 'danger' },
      { label: 'Clear False Alarm', type: 'secondary' }
    ]
  }
];

// === PERMIT TO WORK ===
export const mockPermits: Permit[] = [
  {
    id: 'ptw001',
    permitNumber: 'PTW-2026-0812',
    type: 'HotWork',
    title: 'HN-301 Engine Room Welds',
    description: 'Structure welding for MTU engine bed plates using SMAW welding machines. Confined space guidelines apply.',
    location: 'HN-301, Engine Room (Lower Deck)',
    zone: 'Bay1',
    vesselId: 'hn301',
    hullNumber: 'HN-301',
    requestedBy: 'Amit Sharma (Supervisor)',
    requestedAt: '2026-06-26T07:00:00Z',
    validFrom: '2026-06-26T08:00:00Z',
    validTo: '2026-06-26T18:00:00Z',
    status: 'Active',
    hazards: ['Flammable environment', 'Confined space entry', 'Toxic fumes', 'Electric shock'],
    ppe: ['Safety Harness', 'Welding Helmet (Auto-darkening)', 'Leather Welder Jacket', 'Respirator (Half-mask)', 'Gas Detector (Portable)'],
    personnel: ['Rajesh Kumar (Welder)', 'Ali Al-Hassani (Safety Watch)', 'John Doe (Fitter)'],
    maxPersonnel: 4,
    currentPersonnel: 3,
    hotWorkRadius: 5.0,
    gasReadings: [
      { gas: 'O2', value: 20.9, unit: '%', limit: 19.5, status: 'Safe' },
      { gas: 'LEL (Hydrocarbons)', value: 0, unit: '%', limit: 10, status: 'Safe' },
      { gas: 'H2S', value: 0, unit: 'ppm', limit: 10, status: 'Safe' },
      { gas: 'CO', value: 2, unit: 'ppm', limit: 25, status: 'Safe' }
    ],
    approvalSteps: [
      { step: 1, role: 'Applicant', approverName: 'Amit Sharma', approvedAt: '2026-06-26T07:15:00Z', status: 'Completed' },
      { step: 2, role: 'Area Supervisor', approverName: 'Hassan Al-Mansoori', approvedAt: '2026-06-26T07:30:00Z', status: 'Completed' },
      { step: 3, role: 'HSE Officer', approverName: 'Faisal Al-Zaabi', approvedAt: '2026-06-26T07:45:00Z', status: 'Completed' },
      { step: 4, role: 'Area Manager', approverName: 'Saeed Al-Qubaisi', approvedAt: '2026-06-26T08:00:00Z', status: 'Completed' }
    ]
  },
  {
    id: 'ptw002',
    permitNumber: 'PTW-2026-0813',
    type: 'WorkingAtHeight',
    title: 'HN-101 Radar Mast Outfitting',
    description: 'Installation of Rohde & Schwarz communications antenna systems on the main naval superstructure mast.',
    location: 'HN-101, Main Mast (Height 18m)',
    zone: 'Quayside',
    vesselId: 'hn101',
    hullNumber: 'HN-101',
    requestedBy: 'Francois Mercer (CMN Elec Supervisor)',
    requestedAt: '2026-06-26T08:00:00Z',
    validFrom: '2026-06-26T09:00:00Z',
    validTo: '2026-06-26T17:00:00Z',
    status: 'Active',
    hazards: ['Fall from height', 'High winds', 'Objects dropped from height', 'Radiation hazard'],
    ppe: ['Full Body Fall Protection Harness', 'Shock Absorbing Lanyard', 'Rigid Anchor Point Connectors', 'Safety Helmet with Chin Strap'],
    personnel: ['Marc Dubois (Electrician)', 'Naser Al-Harbi (Liaison Officer)'],
    maxPersonnel: 3,
    currentPersonnel: 2,
    approvalSteps: [
      { step: 1, role: 'Applicant', approverName: 'Francois Mercer', approvedAt: '2026-06-26T08:10:00Z', status: 'Completed' },
      { step: 2, role: 'Area Supervisor', approverName: 'Hassan Al-Mansoori', approvedAt: '2026-06-26T08:25:00Z', status: 'Completed' },
      { step: 3, role: 'HSE Officer', approverName: 'Faisal Al-Zaabi', approvedAt: '2026-06-26T08:40:00Z', status: 'Completed' },
      { step: 4, role: 'Area Manager', approverName: 'Saeed Al-Qubaisi', approvedAt: '2026-06-26T09:00:00Z', status: 'Completed' }
    ]
  },
  {
    id: 'ptw003',
    permitNumber: 'PTW-2026-0814',
    type: 'ConfinedSpace',
    title: 'HN-202 Double Bottom Tank Inspection',
    description: 'Lloyds Register surveyor attendance for structural inspection of double bottom ballast tank DB-03.',
    location: 'HN-202, DB-03 Ballast Tank (Frames 45-52)',
    zone: 'Bay2',
    vesselId: 'hn202',
    hullNumber: 'HN-202',
    requestedBy: 'Elena Rostova (QA Lead)',
    requestedAt: '2026-06-26T11:00:00Z',
    validFrom: '2026-06-26T13:30:00Z',
    validTo: '2026-06-26T16:30:00Z',
    status: 'PendingHSE',
    hazards: ['O2 deficiency', 'Labyrinth entry/exit', 'Slippery surfaces', 'Poor ventilation'],
    ppe: ['Continuous Gas Monitor', 'Self-Contained Breathing Apparatus (SCBA) standby', 'Intrinsically Safe Headtorch', 'Safety Line'],
    personnel: ['Elena Rostova (QA Inspector)', 'Arthur Pendelton (LR Surveyor)', 'Sanjay Dutt (HSE Watch)'],
    maxPersonnel: 3,
    currentPersonnel: 0,
    gasReadings: [
      { gas: 'O2', value: 20.8, unit: '%', limit: 19.5, status: 'Safe' },
      { gas: 'LEL', value: 0, unit: '%', limit: 10, status: 'Safe' },
      { gas: 'CO', value: 1, unit: 'ppm', limit: 25, status: 'Safe' }
    ],
    approvalSteps: [
      { step: 1, role: 'Applicant', approverName: 'Elena Rostova', approvedAt: '2026-06-26T11:15:00Z', status: 'Completed' },
      { step: 2, role: 'Area Supervisor', approverName: 'Hassan Al-Mansoori', approvedAt: '2026-06-26T11:45:00Z', status: 'Completed' },
      { step: 3, role: 'HSE Officer', status: 'Active' },
      { step: 4, role: 'Area Manager', status: 'Pending' }
    ]
  }
];

// === QUALITY / NCR ===
export const mockNCRs: NCR[] = [
  {
    id: 'ncr001',
    ncrNumber: 'NCR-2026-HN301-042',
    title: 'Porosity in Keel Frame 28 Weld',
    description: 'NDT Ultrasonic Testing (UT) revealed cluster porosity in structural butt weld of keel plate HN301-KP-28. Porosity density exceeds Bureau Veritas naval standard limit of 2%. Rework required.',
    vesselId: 'hn301',
    hullNumber: 'HN-301',
    severity: 'Major',
    status: 'Open',
    defectType: 'Weld Defect (Porosity)',
    location: 'HN-301, Keel Frame 28 Starboard',
    trade: 'StructuralWelder',
    reportedBy: 'Karthik Raja (Quality Inspector)',
    reportedAt: '2026-06-24T09:15:00Z',
    dueDate: '2026-06-29T17:00:00Z',
    classSocietyHold: 'BureauVeritas',
    rootCause: 'Improper gas shielding flow rate due to wind gusts in Bay 1. Welder failed to erect wind barriers.',
    correctiveAction: 'Gouge out weld area back to sound metal. Re-weld joint under complete weather protection tent. Conduct 100% UT re-inspection.',
    reworkHours: 8.5,
    weldJointId: 'WJ-HN301-K28-S'
  },
  {
    id: 'ncr002',
    ncrNumber: 'NCR-2026-HN101-008',
    title: 'Holiday/Thin Film on Antifouling primer',
    description: 'Dry Film Thickness (DFT) gauges detected thin spots (75 microns vs specified 125 microns minimum) on bottom plating bilge keel strakes. Jotun SeaForce epoxy primer base coat.',
    vesselId: 'hn101',
    hullNumber: 'HN-101',
    severity: 'Minor',
    status: 'UnderReview',
    defectType: 'Coating Defect (Low DFT)',
    location: 'HN-101, Bilge Keel Starboard Aft',
    trade: 'Painter',
    reportedBy: 'Karthik Raja (Quality Inspector)',
    reportedAt: '2026-06-25T14:30:00Z',
    dueDate: '2026-06-28T17:00:00Z',
    classSocietyHold: 'LloydRegister',
    rootCause: 'Manual spraying gun blockage causing uneven paint feed.',
    correctiveAction: 'Clean spray systems, light sand affected zone, mask, and spray additional coat to reach target DFT. Re-measure DFT.',
    reworkHours: 4.0
  },
  {
    id: 'ncr003',
    ncrNumber: 'NCR-2026-HN202-012',
    title: 'Deck Plate Delamination / Blistering',
    description: 'Visual inspection of deck assembly blocks HN202-D02 showed surface laminations and blistering in EH36 grade steel plates supplied by vendor. High cracking risk. Class hold registered.',
    vesselId: 'hn202',
    hullNumber: 'HN-202',
    severity: 'Critical',
    status: 'Disputed',
    defectType: 'Material Defect (Steel Plate)',
    location: 'HN-202, Deck Block D02 Fore',
    trade: 'StructuralWelder',
    reportedBy: 'Ahmed Al-Mansoori (QA Engineer)',
    reportedAt: '2026-06-20T10:00:00Z',
    dueDate: '2026-07-05T17:00:00Z',
    classSocietyHold: 'TASNEEF',
    rootCause: 'Mill supplier rolling defect. Laminations detected on macro etching test.',
    correctiveAction: 'Plate must be cut out and completely replaced. Reject supplier batch steel plates. Register defect claim with supplier.',
    reworkHours: 42.0
  }
];

// === PERSONNEL ===
export const mockEmployees: Employee[] = [
  {
    id: 'emp001',
    badgeId: 'EMP-0891',
    name: 'Saeed Al-Qubaisi',
    role: 'Shipyard General Operations Manager',
    department: 'Executive Operations',
    nationality: 'United Arab Emirates',
    isEmirate: true,
    contractType: 'Permanent',
    company: 'ADSB',
    clearanceTier: 5,
    shift: 'Day',
    certifications: [
      { id: 'c1', name: 'Executive Leadership in Defence', code: 'ELD-01', type: 'Management', issuedAt: '2022-03-01', expiresAt: '2027-03-01', issuingBody: 'EDGE Academy', status: 'Valid', daysUntilExpiry: 247 }
    ],
    currentZone: 'Offices',
    onsite: true
  },
  {
    id: 'emp002',
    badgeId: 'EMP-1142',
    name: 'Ahmed Al-Mansoori',
    role: 'Senior Hull QA Engineer',
    trade: 'QualityInspector',
    department: 'Quality Assurance',
    nationality: 'United Arab Emirates',
    isEmirate: true,
    contractType: 'Permanent',
    company: 'ADSB',
    clearanceTier: 4,
    shift: 'Day',
    certifications: [
      { id: 'c2', name: 'CSWIP Senior Welding Inspector (3.2.2)', code: 'CSWIP-Senior', type: 'Quality', issuedAt: '2024-05-10', expiresAt: '2029-05-10', issuingBody: 'TWI UK', status: 'Valid', daysUntilExpiry: 1048 },
      { id: 'c3', name: 'NACE Coating Inspector Level 2', code: 'NACE-2', type: 'Quality', issuedAt: '2023-01-15', expiresAt: '2028-01-15', issuingBody: 'AMPP', status: 'Valid', daysUntilExpiry: 568 }
    ],
    currentZone: 'Bay1',
    onsite: true
  },
  {
    id: 'emp003',
    badgeId: 'EMP-4011',
    name: 'Francois Mercer',
    role: 'Lead Combat Systems Integration Engineer',
    trade: 'CombatSystemsEngineer',
    department: 'Engineering & Commissioning',
    nationality: 'France',
    isEmirate: false,
    contractType: 'SubContractor',
    company: 'CMN Naval France',
    clearanceTier: 6,
    shift: 'Day',
    certifications: [
      { id: 'c4', name: 'Combat Systems Integration Master', code: 'CSI-M', type: 'Combat Systems', issuedAt: '2021-10-10', expiresAt: '2026-10-10', issuingBody: 'Thales Systems', status: 'Valid', daysUntilExpiry: 106 }
    ],
    currentZone: 'Quayside',
    onsite: true,
    hullAssignment: 'HN-101'
  },
  {
    id: 'emp004',
    badgeId: 'EMP-0417',
    name: 'Rajesh Kumar',
    role: 'Structural Welder 6G Multi-Process',
    trade: 'StructuralWelder',
    department: 'Steel Fabrication',
    nationality: 'India',
    isEmirate: false,
    contractType: 'Contractor',
    company: 'Al-Bwardy Marine',
    clearanceTier: 2,
    shift: 'Day',
    certifications: [
      { id: 'c5', name: 'SMAW 6G Weld Qualification (DH36)', code: 'WQ-47', type: 'Welding', issuedAt: '2024-07-10', expiresAt: '2026-07-10', issuingBody: 'Lloyds Register', status: 'ExpiringSoon', daysUntilExpiry: 14 }
    ],
    currentZone: 'Bay1',
    onsite: true,
    hullAssignment: 'HN-301'
  },
  {
    id: 'emp005',
    badgeId: 'EMP-2201',
    name: 'Hamad Al-Kaabi',
    role: 'Apprentice Structural Fabricator',
    trade: 'StructuralWelder',
    department: 'Steel Fabrication',
    nationality: 'United Arab Emirates',
    isEmirate: true,
    contractType: 'Permanent',
    company: 'ADSB',
    clearanceTier: 1,
    shift: 'Day',
    certifications: [
      { id: 'c6', name: 'Basic Shipyard Safety & Scaffold Aware', code: 'BSS-01', type: 'Safety', issuedAt: '2026-01-10', expiresAt: '2027-01-10', issuingBody: 'ADSB HSE Academy', status: 'Valid', daysUntilExpiry: 198 }
    ],
    currentZone: 'SteelFab',
    onsite: true
  }
];

// === INVENTORY / STORES ===
export const mockInventory: InventoryItem[] = [
  {
    id: 'inv001',
    sku: 'STEEL-AH36-PL12',
    name: 'Steel Plate AH36 12mm',
    category: 'Structural',
    subcategory: 'Steel Plates',
    currentStock: 42,
    unit: 'Plates',
    minimumStock: 15,
    reorderPoint: 25,
    warehouse: 'Yard Storage Area A',
    location: 'Section 4B, Rack 2',
    unitCostUSD: 1450,
    totalValueUSD: 60900,
    supplier: 'Emirates Steel Industries',
    leadTimeDays: 14,
    rfidTagId: 'RFID-ST-AH36-12-0042',
    lastMovement: '2026-06-25T11:30:00Z',
    stockStatus: 'Healthy',
    hullAssignments: ['HN-301', 'HN-202']
  },
  {
    id: 'inv002',
    sku: 'WELD-E7018-32',
    name: 'Welding Electrodes E7018 3.2mm',
    category: 'Consumable',
    subcategory: 'Welding Electrodes',
    currentStock: 80,
    unit: 'Boxes (5kg)',
    minimumStock: 100,
    reorderPoint: 150,
    warehouse: 'Main Store Warehouse 1',
    location: 'Aisle C, Shelf 3',
    unitCostUSD: 45,
    totalValueUSD: 3600,
    supplier: 'ESAB Middle East',
    leadTimeDays: 7,
    lastMovement: '2026-06-26T09:00:00Z',
    stockStatus: 'Low'
  },
  {
    id: 'inv003',
    sku: 'PAINT-JOT-SEA-RED',
    name: 'Jotun SeaForce 90 Antifouling Red',
    category: 'Consumable',
    subcategory: 'Marine Coatings',
    currentStock: 8,
    unit: 'Drums (20L)',
    minimumStock: 10,
    reorderPoint: 20,
    warehouse: 'Chemical Store Warehouse 3',
    location: 'Aisle F (Temp Controlled)',
    unitCostUSD: 380,
    totalValueUSD: 3040,
    supplier: 'Jotun UAE',
    leadTimeDays: 5,
    shelfLifeDays: 365,
    expiryDate: '2027-02-15',
    lastMovement: '2026-06-22T08:15:00Z',
    stockStatus: 'Critical',
    hullAssignments: ['HN-101']
  },
  {
    id: 'inv004',
    sku: 'ENG-MTU-INJECTOR',
    name: 'Fuel Injector MTU Series 4000',
    category: 'SparePart',
    subcategory: 'Engine Components',
    currentStock: 18,
    unit: 'Units',
    minimumStock: 4,
    reorderPoint: 8,
    warehouse: 'High-Value Store Warehouse 2',
    location: 'Locked Cabinet 1A',
    unitCostUSD: 2450,
    totalValueUSD: 44100,
    supplier: 'Rolls-Royce Solutions (MTU)',
    leadTimeDays: 45,
    rfidTagId: 'RFID-ENG-MTU-FI-018',
    lastMovement: '2026-06-18T14:00:00Z',
    stockStatus: 'Healthy',
    hullAssignments: ['HN-301']
  }
];

// === COMPLIANCE ===
export const mockCompliance: ComplianceRecord[] = [
  { id: 'c01', standard: 'Lloyd Register Naval Rules', requirement: 'Hull Structural Weld Compliance & NDT Testing', status: 'Compliant', lastAuditDate: '2026-05-12', nextAuditDate: '2026-11-12', findings: 2, openCARs: 0, owner: 'Ahmed Al-Mansoori' },
  { id: 'c02', standard: 'ISO 9001:2015', requirement: 'Quality Management Systems - Shipyard Assembly Control', status: 'Compliant', lastAuditDate: '2026-02-20', nextAuditDate: '2027-02-20', findings: 4, openCARs: 1, owner: 'Elena Rostova' },
  { id: 'c03', standard: 'ISO 45001:2018', requirement: 'Occupational Health & Safety - Confined Space Entry Controls', status: 'PartiallyCompliant', lastAuditDate: '2026-04-10', nextAuditDate: '2026-10-10', findings: 6, openCARs: 2, owner: 'Faisal Al-Zaabi' },
  { id: 'c04', standard: 'ISO 14001:2015', requirement: 'Environmental Management - Paint VOC & Sandblast Grit Disposal', status: 'Compliant', lastAuditDate: '2026-03-15', nextAuditDate: '2027-03-15', findings: 1, openCARs: 0, owner: 'Faisal Al-Zaabi' }
];

// === ESG METRICS ===
export const mockESGMetrics: ESGMetric[] = [
  { id: 'esg01', category: 'Energy', metric: 'Electricity Consumption', value: 182, unit: 'kWh/t of steel', target: 200, previousPeriod: 194, trend: 'down', period: 'May 2026' },
  { id: 'esg02', category: 'Energy', metric: 'Generator Fuel Used', value: 12450, unit: 'Liters', target: 14000, previousPeriod: 13900, trend: 'down', period: 'May 2026' },
  { id: 'esg03', category: 'Carbon', metric: 'Scope 1 - Direct Emissions', value: 34.2, unit: 't CO2e', target: 38.0, previousPeriod: 36.8, trend: 'down', period: 'May 2026', scope: 1 },
  { id: 'esg04', category: 'Carbon', metric: 'Scope 2 - Indirect Emissions', value: 112.5, unit: 't CO2e', target: 120.0, previousPeriod: 118.2, trend: 'down', period: 'May 2026', scope: 2 },
  { id: 'esg05', category: 'Waste', metric: 'Sandblast Grit Recycled', value: 85, unit: '%', target: 90, previousPeriod: 82, trend: 'up', period: 'May 2026' },
  { id: 'esg06', category: 'Water', metric: 'Bilge Water Discharge Compliance', value: 100, unit: '%', target: 100, previousPeriod: 100, trend: 'stable', period: 'May 2026' }
];

// === LIVE SAFETY EVENTS ===
export const mockSafetyEvents: SafetyEvent[] = [
  { id: 'se001', type: 'NearMiss', description: 'Gantry Crane GC-02 wire rope load oscillation during block erection. No load contact. Lift suspended for tag-line fitting adjustment.', zone: 'Bay2', reportedBy: 'John Doe', date: '2026-06-25', status: 'Closed' },
  { id: 'se002', type: 'FirstAid', description: 'Minor burn on right hand of contractor welder during hot work in Bay 1. First aid administered. Worker cleared to return to shift.', zone: 'Bay1', reportedBy: 'Sanjay Dutt', date: '2026-06-26', status: 'Closed' }
];

// === ENV READINGS ===
export const mockEnvReadings: EnvironmentalReading[] = [
  { id: 'env001', sensor: 'VOC Monitor PC-01', zone: 'Painting', parameter: 'Volatile Organic Compounds', value: 42.5, unit: 'ppm', limit: 50.0, timestamp: '2026-06-26T16:00:00Z', status: 'Normal' },
  { id: 'env002', sensor: 'Dust Sensor SB-02', zone: 'Blasting', parameter: 'Particulate Matter PM10', value: 185.0, unit: 'µg/m3', limit: 150.0, timestamp: '2026-06-26T16:00:00Z', status: 'Breach' },
  { id: 'env003', sensor: 'Noise Sentinel N-04', zone: 'SteelFab', parameter: 'Sound Level', value: 88.2, unit: 'dBA', limit: 90.0, timestamp: '2026-06-26T16:00:00Z', status: 'Normal' }
];

// === REAL-TIME SIMULATION TICK ===
export function simulateRealtimeDataUpdates(
  vessels: Vessel[],
  assets: MaintenanceAsset[],
  alerts: Alert[]
) {
  // 1. Simulate minor change in asset sensor values
  assets.forEach((asset) => {
    if (asset.status === 'Operational') {
      asset.sensors.forEach((sensor) => {
        const delta = (Math.random() - 0.5) * 0.05 * (sensor.max - sensor.min);
        let newValue = sensor.value + delta;
        newValue = Math.max(sensor.min, Math.min(sensor.max, newValue));
        sensor.value = Number(newValue.toFixed(1));

        // Shift trend readings
        sensor.trend.push(sensor.value);
        if (sensor.trend.length > 20) {
          sensor.trend.shift();
        }

        // Evaluate thresholds
        if (sensor.value >= sensor.criticalThreshold) {
          sensor.status = 'Critical';
        } else if (sensor.value >= sensor.warningThreshold) {
          sensor.status = 'Warning';
        } else {
          sensor.status = 'Normal';
        }
      });

      // Calculate health score based on sensors
      const worstSensorStatus = asset.sensors.reduce((acc, current) => {
        if (current.status === 'Critical') return 'Critical';
        if (current.status === 'Warning' && acc !== 'Critical') return 'Warning';
        return acc;
      }, 'Normal');

      if (worstSensorStatus === 'Critical') {
        asset.healthScore = Math.max(20, asset.healthScore - 1);
        if (asset.healthScore < 40) asset.status = 'Fault';
      } else if (worstSensorStatus === 'Warning') {
        asset.healthScore = Math.max(60, asset.healthScore - 0.5);
      } else {
        asset.healthScore = Math.min(100, asset.healthScore + 0.1);
      }
    }
  });

  // 2. Randomly tick progress of HN-301 Al Noukhitha or HN-202 (simulating steel fab work)
  const hn301 = vessels.find(v => v.id === 'hn301');
  if (hn301 && Math.random() < 0.05) {
    hn301.completionPercent = Math.min(99.9, Number((hn301.completionPercent + 0.1).toFixed(1)));
  }

  // 3. Random alert acknowledge simulation (if user changes something, or just system ticks)
}
