import React from 'react';
import AppShell from './components/layout/AppShell';
import { useAppStore } from './store/appStore';

// Lazy load modules or direct imports (direct imports are faster for HMR)
import ProgrammeCommandCenter from './modules/programme/ProgrammeCommandCenter';
import AICopilot from './modules/ai-copilot/AICopilot';
import ProgrammeIntelligence from './modules/programme-intelligence/ProgrammeIntelligence';
import HullQualityIntelligence from './modules/hull-quality/HullQualityIntelligence';
import SafetyIntelligence from './modules/safety/SafetyIntelligence';
import AssetMaintenance from './modules/asset-maintenance/AssetMaintenance';
import MarineStores from './modules/marine-stores/MarineStores';
import EngineeringIntelligence from './modules/engineering/EngineeringIntelligence';
import ComplianceGovernance from './modules/compliance/ComplianceGovernance';
import OperationsIntelligence from './modules/operations/OperationsIntelligence';
import ShipyardVisionIntelligence from './modules/vision/ShipyardVisionIntelligence';
import WorkforceIntelligence from './modules/workforce/WorkforceIntelligence';
import ShipyardDigitalTwin from './modules/digital-twin/ShipyardDigitalTwin';
import ARMaintenance from './modules/ar-training/ARMaintenance';
import NavalInnovationHub from './modules/innovation-hub/NavalInnovationHub';
import AutonomousDroneOperations from './modules/autonomous/AutonomousDroneOperations';
import OTSecurity from './modules/ot-security/OTSecurity';
import SustainabilityIntelligence from './modules/sustainability/SustainabilityIntelligence';
import AIAnalyticsForecasting from './modules/analytics/AIAnalyticsForecasting';
import PlatformFoundation from './modules/platform/PlatformFoundation';

function App() {
  const { activeModule } = useAppStore();

  // Render module based on active state
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'programme-command':
        return <ProgrammeCommandCenter />;
      case 'ai-copilot':
        return <AICopilot />;
      case 'programme-intelligence':
        return <ProgrammeIntelligence />;
      case 'hull-quality':
        return <HullQualityIntelligence />;
      case 'safety':
        return <SafetyIntelligence />;
      case 'asset-maintenance':
        return <AssetMaintenance />;
      case 'marine-stores':
        return <MarineStores />;
      case 'engineering':
        return <EngineeringIntelligence />;
      case 'compliance':
        return <ComplianceGovernance />;
      case 'operations':
        return <OperationsIntelligence />;
      case 'vision':
        return <ShipyardVisionIntelligence />;
      case 'workforce':
        return <WorkforceIntelligence />;
      case 'digital-twin':
        return <ShipyardDigitalTwin />;
      case 'ar-training':
        return <ARMaintenance />;
      case 'innovation-hub':
        return <NavalInnovationHub />;
      case 'autonomous':
        return <AutonomousDroneOperations />;
      case 'ot-security':
        return <OTSecurity />;
      case 'sustainability':
        return <SustainabilityIntelligence />;
      case 'analytics':
        return <AIAnalyticsForecasting />;
      case 'platform':
        return <PlatformFoundation />;
      default:
        return <ProgrammeCommandCenter />;
    }
  };

  return <AppShell>{renderActiveModule()}</AppShell>;
}

export default App;
