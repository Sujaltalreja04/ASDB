import { create } from 'zustand';
import {
  mockVessels,
  mockAssets,
  mockAlerts,
  mockPermits,
  mockNCRs,
  mockEmployees,
  mockInventory,
  mockCompliance,
  mockESGMetrics,
  mockSafetyEvents,
  mockEnvReadings,
  simulateRealtimeDataUpdates
} from './index';
import {
  Vessel,
  MaintenanceAsset,
  Permit,
  NCR,
  Employee,
  InventoryItem,
  ComplianceRecord,
  ESGMetric,
  Alert,
  SafetyEvent,
  EnvironmentalReading
} from '../../types/adsb';

interface YardDataState {
  vessels: Vessel[];
  assets: MaintenanceAsset[];
  alerts: Alert[];
  permits: Permit[];
  ncrs: NCR[];
  employees: Employee[];
  inventory: InventoryItem[];
  compliance: ComplianceRecord[];
  esgMetrics: ESGMetric[];
  safetyEvents: SafetyEvent[];
  envReadings: EnvironmentalReading[];
  
  // Mutations
  addPermit: (permit: Omit<Permit, 'id' | 'permitNumber' | 'requestedAt' | 'status' | 'approvalSteps'>) => void;
  updatePermitStatus: (id: string, status: Permit['status']) => void;
  addNCR: (ncr: Omit<NCR, 'id' | 'ncrNumber' | 'reportedAt' | 'status'>) => void;
  updateNCRStatus: (id: string, status: NCR['status']) => void;
  acknowledgeAlert: (id: string) => void;
  runSimulationTick: () => void;
}

export const useYardDataStore = create<YardDataState>((set, get) => ({
  vessels: [...mockVessels],
  assets: [...mockAssets],
  alerts: [...mockAlerts],
  permits: [...mockPermits],
  ncrs: [...mockNCRs],
  employees: [...mockEmployees],
  inventory: [...mockInventory],
  compliance: [...mockCompliance],
  esgMetrics: [...mockESGMetrics],
  safetyEvents: [...mockSafetyEvents],
  envReadings: [...mockEnvReadings],

  addPermit: (newPermit) => set((state) => {
    const permitNumber = `PTW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `ptw${state.permits.length + 1}`;
    
    const permit: Permit = {
      ...newPermit,
      id,
      permitNumber,
      requestedAt: new Date().toISOString(),
      status: 'PendingSupervisor',
      approvalSteps: [
        { step: 1, role: 'Applicant', approverName: newPermit.requestedBy, approvedAt: new Date().toISOString(), status: 'Completed' },
        { step: 2, role: 'Area Supervisor', status: 'Active' },
        { step: 3, role: 'HSE Officer', status: 'Pending' },
        { step: 4, role: 'Area Manager', status: 'Pending' }
      ]
    };
    return { permits: [permit, ...state.permits] };
  }),

  updatePermitStatus: (id, status) => set((state) => ({
    permits: state.permits.map((p) => {
      if (p.id !== id) return p;
      
      // Update approval steps accordingly
      const steps = [...p.approvalSteps];
      if (status === 'Active') {
        steps.forEach(s => {
          s.status = 'Completed';
          if (!s.approvedAt) {
            s.approvedAt = new Date().toISOString();
            s.approverName = s.role === 'Area Supervisor' ? 'Hassan Al-Mansoori' 
                           : s.role === 'HSE Officer' ? 'Faisal Al-Zaabi' 
                           : 'Saeed Al-Qubaisi';
          }
        });
      } else if (status === 'Closed') {
        // Closed by user
      }

      return { ...p, status, approvalSteps: steps };
    })
  })),

  addNCR: (newNcr) => set((state) => {
    const ncrNumber = `NCR-${new Date().getFullYear()}-${newNcr.hullNumber}-${Math.floor(100 + Math.random() * 900)}`;
    const id = `ncr${state.ncrs.length + 1}`;
    
    const ncr: NCR = {
      ...newNcr,
      id,
      ncrNumber,
      reportedAt: new Date().toISOString(),
      status: 'Open'
    };
    
    // Increment NCR open count on vessel
    const vessels = state.vessels.map(v => {
      if (v.hullNumber === newNcr.hullNumber) {
        return { ...v, ncrsOpen: v.ncrsOpen + 1 };
      }
      return v;
    });

    return { ncrs: [ncr, ...state.ncrs], vessels };
  }),

  updateNCRStatus: (id, status) => set((state) => {
    let affectedHull = '';
    const ncrs = state.ncrs.map((n) => {
      if (n.id !== id) return n;
      affectedHull = n.hullNumber;
      return { ...n, status, closedAt: status === 'Closed' ? new Date().toISOString() : undefined };
    });

    const vessels = state.vessels.map(v => {
      if (v.hullNumber === affectedHull && status === 'Closed') {
        return { ...v, ncrsOpen: Math.max(0, v.ncrsOpen - 1) };
      }
      return v;
    });

    return { ncrs, vessels };
  }),

  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map((a) => 
      a.id === id ? { ...a, isAcknowledged: true, isRead: true } : a
    )
  })),

  runSimulationTick: () => set((state) => {
    const vesselsCopy = JSON.parse(JSON.stringify(state.vessels)) as Vessel[];
    const assetsCopy = JSON.parse(JSON.stringify(state.assets)) as MaintenanceAsset[];
    const alertsCopy = JSON.parse(JSON.stringify(state.alerts)) as Alert[];
    
    simulateRealtimeDataUpdates(vesselsCopy, assetsCopy, alertsCopy);
    
    return {
      vessels: vesselsCopy,
      assets: assetsCopy,
      alerts: alertsCopy
    };
  })
}));

// Setup interval for live simulation
if (typeof window !== 'undefined') {
  setInterval(() => {
    useYardDataStore.getState().runSimulationTick();
  }, 10000); // simulation tick every 10s
}
