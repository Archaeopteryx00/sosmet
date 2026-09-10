import React from 'react';
import { Home, Compass, PlusSquare, Heart, User } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';
import { NavigationTab } from '../../types/sosmet';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, notifications, setSelectedProfileUser } = useSosmetStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleTabClick = (tab: NavigationTab) => {
    if (tab === 'PROFILE') {
      setSelectedProfileUser(null); // Clear selected other profile to view own profile
    }
    setActiveTab(tab);
  };

  return (
    <nav style={styles.nav}>
      <button 
        onClick={() => handleTabClick('HOME')}
        style={{ ...styles.tabBtn, color: activeTab === 'HOME' ? 'var(--text-primary)' : 'var(--text-muted)' }}
        aria-label="Feed Utama"
      >
        <Home size={24} strokeWidth={activeTab === 'HOME' ? 2.4 : 1.8} />
      </button>

      <button 
        onClick={() => handleTabClick('DISCOVER')}
        style={{ ...styles.tabBtn, color: activeTab === 'DISCOVER' ? 'var(--text-primary)' : 'var(--text-muted)' }}
        aria-label="Jelajah"
      >
        <Compass size={24} strokeWidth={activeTab === 'DISCOVER' ? 2.4 : 1.8} />
      </button>

      <button 
        onClick={() => handleTabClick('CREATE')}
        style={{ ...styles.tabBtn, ...styles.createBtn }}
        aria-label="Buat Postingan"
      >
        <PlusSquare size={26} strokeWidth={2} style={{ color: 'var(--text-primary)' }} />
      </button>

      <button 
        onClick={() => handleTabClick('ACTIVITY')}
        style={{ ...styles.tabBtn, color: activeTab === 'ACTIVITY' ? 'var(--text-primary)' : 'var(--text-muted)', position: 'relative' }}
        aria-label="Notifikasi"
      >
        <Heart size={24} strokeWidth={activeTab === 'ACTIVITY' ? 2.4 : 1.8} />
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      <button 
        onClick={() => handleTabClick('PROFILE')}
        style={{ ...styles.tabBtn, color: activeTab === 'PROFILE' ? 'var(--text-primary)' : 'var(--text-muted)' }}
        aria-label="Profil Saya"
      >
        <User size={24} strokeWidth={activeTab === 'PROFILE' ? 2.4 : 1.8} />
      </button>
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    height: '56px',
    backgroundColor: 'var(--bg-primary)',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 'var(--safe-area-bottom)',
    position: 'relative',
    zIndex: 20
  },
  tabBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 12px',
    transition: 'transform 0.1s ease'
  },
  createBtn: {
    borderRadius: '8px'
  },
  badge: {
    position: 'absolute',
    top: '4px',
    right: '8px',
    backgroundColor: 'var(--accent-red)',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '700',
    borderRadius: '99px',
    padding: '2px 5px',
    minWidth: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
