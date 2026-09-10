import React, { useEffect } from 'react';
import { useSosmetStore } from '../../store/sosmetStore';
import { Navbar } from './Navbar';
import { FeedView } from '../feed/FeedView';
import { DiscoverView } from '../discover/DiscoverView';
import { CreatePostModal } from '../create/CreatePostModal';
import { NotificationView } from '../notifications/NotificationView';
import { ProfileView } from '../profile/ProfileView';
import { OnboardingModal } from '../onboarding/OnboardingModal';
import { SimulationDebugDrawer } from '../debug/SimulationDebugDrawer';
import { Cpu } from 'lucide-react';

export const MobileShell: React.FC = () => {
  const { 
    activeTab, 
    isOnboarded, 
    triggerSimulationTick, 
    simulationConfig, 
    toggleDebugDrawer 
  } = useSosmetStore();

  // Background simulation tick timer loop
  useEffect(() => {
    if (simulationConfig.isPaused) return;

    // Tick interval depends on simulation speed (base 10 seconds)
    const intervalMs = Math.max(1000, 10000 / simulationConfig.speed);

    const timer = setInterval(() => {
      triggerSimulationTick();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [simulationConfig.isPaused, simulationConfig.speed, triggerSimulationTick]);

  return (
    <div className="app-viewport">
      {/* Discreet Developer Debug Trigger in Top Right Corner */}
      <button 
        onClick={toggleDebugDrawer}
        style={styles.debugTrigger}
        title="Buka Inspector Simulasi"
        aria-label="Inspector Simulasi"
      >
        <Cpu size={14} color="var(--text-muted)" />
      </button>

      {/* Main Tab Screen Content */}
      <div style={styles.mainContent}>
        {activeTab === 'HOME' && <FeedView />}
        {activeTab === 'DISCOVER' && <DiscoverView />}
        {activeTab === 'CREATE' && <CreatePostModal />}
        {activeTab === 'ACTIVITY' && <NotificationView />}
        {activeTab === 'PROFILE' && <ProfileView />}
      </div>

      {/* Bottom Navbar */}
      <Navbar />

      {/* Overlays */}
      {!isOnboarded && <OnboardingModal />}
      <SimulationDebugDrawer />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  mainContent: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  debugTrigger: {
    position: 'absolute',
    top: '14px',
    right: '14px',
    zIndex: 50,
    opacity: 0.6,
    padding: '4px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
