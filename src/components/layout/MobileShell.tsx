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

    const intervalMs = Math.max(1000, 10000 / simulationConfig.speed);

    const timer = setInterval(() => {
      triggerSimulationTick();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [simulationConfig.isPaused, simulationConfig.speed, triggerSimulationTick]);

  // Keyboard shortcut Ctrl + Shift + D to toggle debug drawer for dev mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        toggleDebugDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDebugDrawer]);

  return (
    <div className="app-viewport">
      {/* Main Tab Content Container with bottom padding for fixed navbar */}
      <div style={styles.mainContent}>
        {activeTab === 'HOME' && <FeedView />}
        {activeTab === 'DISCOVER' && <DiscoverView />}
        {activeTab === 'CREATE' && <CreatePostModal />}
        {activeTab === 'ACTIVITY' && <NotificationView />}
        {activeTab === 'PROFILE' && <ProfileView />}
      </div>

      {/* Fixed Bottom Navbar */}
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
    position: 'relative',
    paddingBottom: '0px'
  }
};
