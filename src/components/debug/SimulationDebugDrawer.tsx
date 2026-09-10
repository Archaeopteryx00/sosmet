import React from 'react';
import { Play, Pause, FastForward, RotateCcw, X, Activity, Cpu } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';

export const SimulationDebugDrawer: React.FC = () => {
  const { 
    isDebugOpen, 
    toggleDebugDrawer, 
    syntheticUsers, 
    posts, 
    eventsLog, 
    simulationConfig, 
    updateSimulationConfig,
    triggerSimulationTick,
    resetWorld
  } = useSosmetStore();

  if (!isDebugOpen) return null;

  const handleSpeedChange = (speed: number) => {
    updateSimulationConfig({ speed });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.drawer} className="fade-in">
        {/* Drawer Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cpu size={18} color="var(--accent-blue)" />
            <h3 style={styles.title}>Simulation Engine Inspector</h3>
          </div>
          <button onClick={toggleDebugDrawer} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {/* Stats Summary */}
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <span style={styles.statVal}>{syntheticUsers.length}</span>
            <span style={styles.statLbl}>Pengguna Sintetis</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statVal}>{posts.length}</span>
            <span style={styles.statLbl}>Total Postingan</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statVal}>{simulationConfig.totalTicks}</span>
            <span style={styles.statLbl}>Total Ticks</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statVal}>{eventsLog.length}</span>
            <span style={styles.statLbl}>Events Recorded</span>
          </div>
        </div>

        {/* Simulation Controls */}
        <div style={styles.controlsSection}>
          <span style={styles.controlLabel}>Kontrol Simulasi:</span>
          <div style={styles.btnRow}>
            <button
              onClick={() => updateSimulationConfig({ isPaused: !simulationConfig.isPaused })}
              className="btn-secondary"
              style={styles.ctrlBtn}
            >
              {simulationConfig.isPaused ? (
                <>
                  <Play size={14} style={{ marginRight: 4 }} /> Resume
                </>
              ) : (
                <>
                  <Pause size={14} style={{ marginRight: 4 }} /> Pause
                </>
              )}
            </button>

            <button onClick={triggerSimulationTick} className="btn-primary" style={styles.ctrlBtn}>
              <FastForward size={14} style={{ marginRight: 4 }} /> Trigger Tick
            </button>

            <button onClick={resetWorld} className="btn-secondary" style={{ ...styles.ctrlBtn, color: 'var(--accent-red)' }}>
              <RotateCcw size={14} style={{ marginRight: 4 }} /> Reset World
            </button>
          </div>

          {/* Speed Selector */}
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Kecepatan:</span>
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  border: 'none',
                  backgroundColor: simulationConfig.speed === s ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                  color: simulationConfig.speed === s ? 'var(--bg-primary)' : 'var(--text-primary)'
                }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Event Stream Log */}
        <div style={styles.logSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Activity size={14} color="var(--text-secondary)" />
            <span style={{ fontSize: 12, fontWeight: 700 }}>Live Event Stream:</span>
          </div>

          <div style={styles.logList}>
            {eventsLog.length === 0 ? (
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Belum ada event simulasi terdaftar. Klik "Trigger Tick"!</p>
            ) : (
              eventsLog.map((evt) => (
                <div key={evt.id} style={styles.logRow}>
                  <span style={styles.logTime}>
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span style={styles.logDesc}>{evt.description}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 90,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  drawer: {
    backgroundColor: 'var(--bg-primary)',
    borderTopLeftRadius: 'var(--radius-lg)',
    borderTopRightRadius: 'var(--radius-lg)',
    padding: '16px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-modal)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  title: {
    fontSize: '14px',
    fontWeight: '700'
  },
  closeBtn: {
    padding: '4px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
    marginBottom: '12px'
  },
  statBox: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 4px',
    textAlign: 'center'
  },
  statVal: {
    display: 'block',
    fontWeight: '700',
    fontSize: '14px'
  },
  statLbl: {
    fontSize: '9px',
    color: 'var(--text-muted)'
  },
  controlsSection: {
    marginBottom: '12px',
    backgroundColor: 'var(--bg-secondary)',
    padding: '10px',
    borderRadius: 'var(--radius-md)'
  },
  controlLabel: {
    fontSize: '11px',
    fontWeight: '600',
    display: 'block',
    marginBottom: '6px'
  },
  btnRow: {
    display: 'flex',
    gap: '6px'
  },
  ctrlBtn: {
    flex: 1,
    padding: '6px 8px',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logSection: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  logList: {
    flex: 1,
    maxHeight: '180px',
    overflowY: 'auto',
    backgroundColor: '#111111',
    color: '#00ff88',
    fontFamily: 'monospace',
    fontSize: '10px',
    padding: '8px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  logRow: {
    display: 'flex',
    gap: '6px'
  },
  logTime: {
    color: '#888888',
    flexShrink: 0
  },
  logDesc: {
    wordBreak: 'break-word'
  }
};
