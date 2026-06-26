// ============================================================
// ADSB NavalOS – Complete Domain Type System
// Purpose-built for Abu Dhabi Ship Building (ADSB) – EDGE Group
// ============================================================

// === ENUMS ===

export type ClearanceTier = 1 | 2 | 3 | 4 | 5 | 6;

export type VesselClass =
  | 'Al-Dorra'    // Kuwait 62m missile boat
  | 'BR71-MKII'   // Angola 71m corvette (Combattante-class)
  | 'Falaj-3'     // UAE OPV
  | 'Falaj-2'     // UAE in-service OPV
  | 'Baynunah'    // UAE corvette
  | 'Ghannatha'   // Troop carrier
  | 'FIP-120'     // Fast interceptor
  | 'ITEP-160'    // Fast interceptor
  | 'ITEP-170'    // Fast interceptor
  | 'FA-400'      // Future OPV design
  | 'Commercial';

export type BuildPhase =
  | 'Contract'
  | 'Design'
  | 'SteelCutting'
  | 'SteelFabrication'
  | 'BlockAssembly'
  | 'ModuleAssembly'
  | 'Erection'
  | 'Launch'
  | 'Outfitting'
  | 'SeaTrials'
  | 'Delivery';

export type Programme = 'Kuwait' | 'Angola' | 'UAE' | 'Commercial' | 'InService' | 'EdgeGroup';

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export type AlertCategory =
  | 'Safety'
  | 'Maintenance'
  | 'Quality'
  | 'Schedule'
  | 'Security'
  | 'Environmental'
  | 'Compliance'
  | 'System';

export type PermitType =
  | 'HotWork'
  | 'ConfinedSpace'
  | 'WorkingAtHeight'
  | 'ElectricalIsolation'
  | 'CraneOperation'
  | 'GeneralAccess';

export type PermitStatus = 'Draft' | 'PendingSupervisor' | 'PendingHSE' | 'PendingManager' | 'Active' | 'Closed' | 'Cancelled' | 'Expired';

export type AssetStatus = 'Operational' | 'Maintenance' | 'Fault' | 'Idle' | 'Offline';

export type NCRStatus = 'Open' | 'UnderReview' | 'Disputed' | 'Closed' | 'Voided';

export type NCRSeverity = 'Minor' | 'Major' | 'Critical';

export type ClassSociety = 'LloydRegister' | 'BureauVeritas' | 'TASNEEF';

export type InspectionResult = 'Pass' | 'Fail' | 'Conditional' | 'Hold' | 'Pending';

export type WorkOrderStatus = 'Planned' | 'InProgress' | 'OnHold' | 'Completed' | 'Cancelled';

export type Shift = 'Day' | 'Night';

export type TradeCategory =
  | 'StructuralWelder'
  | 'PipeFitter'
  | 'Electrician'
  | 'CombatSystemsEngineer'
  | 'Painter'
  | 'Rigger'
  | 'NDTTechnician'
  | 'CraneOperator'
  | 'MarineEngineer'
  | 'QualityInspector'
  | 'SafetyOfficer';

export type SteelGrade = 'AH36' | 'DH36' | 'EH36' | 'A' | 'B' | 'D' | 'E';

export type NDTMethod = 'UT' | 'MPI' | 'DPI' | 'RT' | 'VT';

export type YardZone =
  | 'Bay1' | 'Bay2' | 'Bay3' | 'Bay4'
  | 'SteelFab'
  | 'Outfitting'
  | 'Painting'
  | 'Blasting'
  | 'Quayside'
  | 'Warehouse1' | 'Warehouse2' | 'Warehouse3' | 'Warehouse4'
  | 'Offices'
  | 'MinaZayed';

// === CORE ENTITIES ===

export interface Vessel {
  id: string;
  hullNumber: string;            // e.g. "HN-301"
  name: string;                   // e.g. "AL NOUKHITHA"
  vesselClass: VesselClass;
  programme: Programme;
  customer: string;
  lengthMetres: number;
  currentPhase: BuildPhase;
  completionPercent: number;
  scheduleAdherenceDays: number;  // positive = ahead, negative = behind
  location: YardZone | string;
  buildBay?: string;
  spi: number;                    // Schedule Performance Index
  cpi: number;                    // Cost Performance Index
  budgetUSD: number;
  actualCostUSD: number;
  contractDate: string;
  targetDelivery: string;
  forecastDelivery: string;
  milestones: VesselMilestone[];
  classSociety: ClassSociety[];
  flagState: string;
  propulsion: string;
  ncrsOpen: number;
  qualityScore: number;           // 0-100
  lastUpdated: string;
}

export interface VesselMilestone {
  id: string;
  name: string;
  phase: BuildPhase;
  plannedDate: string;
  forecastDate: string;
  actualDate?: string;
  status: 'Completed' | 'InProgress' | 'Upcoming' | 'Delayed';
}

export interface BuildPhaseInfo {
  phase: BuildPhase;
  label: string;
  shortLabel: string;
  color: string;
  order: number;
}

export interface Workspace {
  id: string;
  name: string;
  shortName: string;
  description: string;
  location: string;
  programme: Programme;
  activeVessels: number;
  personnel: number;
  alertCount: number;
  status: 'Active' | 'Standby' | 'Offline';
  coordinates?: { lat: number; lng: number };
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  clearanceTier: ClearanceTier;
  clearanceLabel: string;
  avatarInitials: string;
  avatarColor: string;
  workspaceId: string;
  nationality: string;
  isEmirate: boolean;
}

// === ALERTS ===

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  zone?: YardZone | string;
  vesselId?: string;
  hullNumber?: string;
  assetId?: string;
  timestamp: string;
  isRead: boolean;
  isAcknowledged: boolean;
  source: string;
  actions?: AlertAction[];
}

export interface AlertAction {
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  href?: string;
}

// === KPIs ===

export interface KPIMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;           // percentage change
  changePeriod: string;
  trend: 'up' | 'down' | 'stable';
  positive: 'up' | 'down'; // which direction is good
  target?: number;
  sparkline?: number[];
  severity?: AlertSeverity;
}

// === PERMITS ===

export interface Permit {
  id: string;
  permitNumber: string;
  type: PermitType;
  title: string;
  description: string;
  location: string;
  zone: YardZone | string;
  vesselId?: string;
  hullNumber?: string;
  requestedBy: string;
  requestedAt: string;
  validFrom: string;
  validTo: string;
  status: PermitStatus;
  approvalSteps: PermitApprovalStep[];
  hazards: string[];
  ppe: string[];
  personnel: string[];
  gasReadings?: GasReading[];
  hotWorkRadius?: number;
  maxPersonnel?: number;
  currentPersonnel?: number;
}

export interface PermitApprovalStep {
  step: number;
  role: string;
  approverName?: string;
  approvedAt?: string;
  status: 'Completed' | 'Active' | 'Pending';
  comments?: string;
}

export interface GasReading {
  gas: string;
  value: number;
  unit: string;
  limit: number;
  status: 'Safe' | 'Warning' | 'Danger';
}

// === ASSETS & MAINTENANCE ===

export interface MaintenanceAsset {
  id: string;
  assetId: string;            // e.g. "GC-01"
  name: string;
  category: string;
  location: YardZone | string;
  status: AssetStatus;
  healthScore: number;          // 0-100
  rul: number;                  // Remaining Useful Life (days)
  failureProbability7d: number;
  failureProbability14d: number;
  failureProbability30d: number;
  lastMaintenance: string;
  nextMaintenance: string;
  totalOperatingHours: number;
  specifications: Record<string, string>;
  openWorkOrders: number;
  sensors: AssetSensor[];
  anomalies: string[];
}

export interface AssetSensor {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  warningThreshold: number;
  criticalThreshold: number;
  status: 'Normal' | 'Warning' | 'Critical';
  trend: number[];    // last 24 readings
}

export interface WorkOrder {
  id: string;
  woNumber: string;
  title: string;
  description: string;
  assetId: string;
  assetName: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: WorkOrderStatus;
  type: 'Planned' | 'Corrective' | 'Predictive' | 'Emergency';
  assignedTo: string;
  estimatedHours: number;
  actualHours?: number;
  createdAt: string;
  dueDate: string;
  completedAt?: string;
  parts: WorkOrderPart[];
}

export interface WorkOrderPart {
  partNumber: string;
  description: string;
  quantity: number;
  available: boolean;
}

// === QUALITY / NCR ===

export interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  vesselId: string;
  hullNumber: string;
  severity: NCRSeverity;
  status: NCRStatus;
  defectType: string;
  location: string;
  trade: TradeCategory;
  reportedBy: string;
  reportedAt: string;
  dueDate: string;
  closedAt?: string;
  classSocietyHold?: ClassSociety;
  rootCause?: string;
  correctiveAction?: string;
  reworkHours?: number;
  images?: string[];
  weldJointId?: string;
}

export interface InspectionRecord {
  id: string;
  vesselId: string;
  hullNumber: string;
  jointId?: string;
  type: 'Visual' | 'NDT' | 'Dimensional' | 'PressureTest' | 'FinalInspection';
  ndtMethod?: NDTMethod;
  result: InspectionResult;
  inspector: string;
  classSurveyor?: string;
  classSociety?: ClassSociety;
  date: string;
  location: string;
  findings: string[];
  documents: string[];
}

// === WORKFORCE ===

export interface Employee {
  id: string;
  badgeId: string;
  name: string;
  role: string;
  trade?: TradeCategory;
  department: string;
  nationality: string;
  isEmirate: boolean;
  contractType: 'Permanent' | 'Contractor' | 'SubContractor' | 'Visitor';
  company: string;
  clearanceTier: ClearanceTier;
  shift: Shift;
  certifications: Certification[];
  currentZone?: YardZone | string;
  onsite: boolean;
  attendedAt?: string;
  hullAssignment?: string;
}

export interface Certification {
  id: string;
  name: string;
  code: string;
  type: string;
  issuedAt: string;
  expiresAt: string;
  issuingBody: string;
  status: 'Valid' | 'ExpiringSoon' | 'Expired';
  daysUntilExpiry: number;
}

// === INVENTORY ===

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Structural' | 'Outfitting' | 'Consumable' | 'SparePart' | 'Controlled' | 'PPE';
  subcategory: string;
  currentStock: number;
  unit: string;
  minimumStock: number;
  reorderPoint: number;
  warehouse: string;
  location: string;
  unitCostUSD: number;
  totalValueUSD: number;
  supplier: string;
  leadTimeDays: number;
  shelfLifeDays?: number;
  expiryDate?: string;
  hullAssignments?: string[];
  rfidTagId?: string;
  lastMovement: string;
  stockStatus: 'Healthy' | 'Low' | 'Critical' | 'Overstock' | 'Expired';
}

// === COMPLIANCE ===

export interface ComplianceRecord {
  id: string;
  standard: string;           // e.g. "ISO 9001:2015"
  requirement: string;
  status: 'Compliant' | 'NonCompliant' | 'PartiallyCompliant' | 'NotAssessed';
  lastAuditDate?: string;
  nextAuditDate?: string;
  findings: number;
  openCARs: number;
  owner: string;
}

export interface AuditFinding {
  id: string;
  findingNumber: string;
  auditId: string;
  standard: string;
  severity: 'MajorNC' | 'MinorNC' | 'Observation' | 'OpportunityForImprovement';
  description: string;
  rootCause?: string;
  correctiveAction?: string;
  owner: string;
  dueDate: string;
  status: 'Open' | 'InProgress' | 'VerificationPending' | 'Closed';
  openedAt: string;
  closedAt?: string;
}

// === SUSTAINABILITY / ESG ===

export interface ESGMetric {
  id: string;
  category: 'Energy' | 'Carbon' | 'Water' | 'Waste';
  metric: string;
  value: number;
  unit: string;
  target: number;
  previousPeriod: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  scope?: 1 | 2 | 3;
}

// === AI COPILOT ===

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: CopilotMode;
  attachments?: ChatAttachment[];
  isLoading?: boolean;
  citations?: string[];
}

export type CopilotMode =
  | 'naval-engineering'
  | 'maintenance'
  | 'safety'
  | 'programme'
  | 'executive'
  | 'document-intelligence';

export interface ChatAttachment {
  name: string;
  type: 'document' | 'image' | 'report';
  url?: string;
}

// === SAFETY ===

export interface SafetyEvent {
  id: string;
  type: 'NearMiss' | 'FirstAid' | 'MedicalTreatment' | 'LostTime' | 'Fatality' | 'PropertyDamage';
  description: string;
  zone: YardZone | string;
  reportedBy: string;
  date: string;
  status: 'UnderInvestigation' | 'Closed' | 'Pending';
  lostDays?: number;
  rca?: string;
}

export interface EnvironmentalReading {
  id: string;
  sensor: string;
  zone: YardZone | string;
  parameter: string;
  value: number;
  unit: string;
  limit: number;
  timestamp: string;
  status: 'Normal' | 'Warning' | 'Breach';
}

// === DIGITAL TWIN ===

export interface TwinObject {
  id: string;
  name: string;
  type: 'Bay' | 'Crane' | 'Vessel' | 'Zone' | 'Equipment' | 'Personnel';
  position: { x: number; y: number; z: number };
  dimensions: { w: number; h: number; d: number };
  status: string;
  color: string;
  metadata?: Record<string, string | number | boolean>;
}

// === ANALYTICS ===

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ForecastResult {
  vesselId: string;
  hullNumber: string;
  baselineDelivery: string;
  currentForecast: string;
  p10: string;      // 10th percentile (optimistic)
  p50: string;      // median
  p90: string;      // 90th percentile (pessimistic)
  confidencePercent: number;
  keyRisks: string[];
  recommendedActions: string[];
}

export interface AppState {
  theme: 'dark' | 'light';
  activeWorkspace: string;
  sidebarExpanded: boolean;
  activeModule: string;
  notificationsOpen: boolean;
  copilotOpen: boolean;
  commandPaletteOpen: boolean;
}
