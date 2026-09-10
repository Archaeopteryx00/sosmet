import React, { useState } from 'react';
import { Settings, Grid, Bookmark, Key, Check } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';

export const ProfileView: React.FC = () => {
  const { 
    userProfile, 
    selectedProfileUser, 
    posts, 
    relationships, 
    toggleFollowUser, 
    updateUserProfile,
    simulationConfig,
    updateSimulationConfig
  } = useSosmetStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editBio, setEditBio] = useState(userProfile.bio);
  const [editName, setEditName] = useState(userProfile.displayName);
  const [apiKeyInput, setApiKeyInput] = useState(simulationConfig.aiApiKey || '');

  // Determine if viewing own profile or synthetic user profile
  const targetUser = selectedProfileUser || userProfile;
  const isOwnProfile = targetUser.id === userProfile.id;

  const relKey = `${userProfile.id}_${targetUser.id}`;
  const isFollowing = relationships[relKey]?.isFollowing;

  // Filter posts by target user
  const userPosts = posts.filter((p) => p.userId === targetUser.id);

  const handleSaveProfile = () => {
    updateUserProfile({
      displayName: editName,
      bio: editBio
    });
    setIsEditing(false);
  };

  const handleSaveApiKey = () => {
    updateSimulationConfig({
      aiApiKey: apiKeyInput.trim(),
      aiProvider: apiKeyInput.trim() ? 'gemini' : 'fallback'
    });
    setShowSettingsModal(false);
  };

  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <header style={styles.header}>
        <h2 style={styles.usernameHeader}>@{targetUser.username}</h2>
        {isOwnProfile && (
          <button onClick={() => setShowSettingsModal(true)} style={styles.iconBtn} aria-label="Pengaturan AI">
            <Settings size={20} color="var(--text-primary)" />
          </button>
        )}
      </header>

      {/* Main Profile Info */}
      <main style={styles.content}>
        <div style={styles.profileHeader}>
          {/* Avatar */}
          <div style={styles.avatarWrapper}>
            <img src={targetUser.avatar} alt={targetUser.username} style={styles.avatar} />
          </div>

          {/* Stats */}
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{userPosts.length}</span>
              <span style={styles.statLabel}>Postingan</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{targetUser.followersCount}</span>
              <span style={styles.statLabel}>Pengikut</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{targetUser.followingCount}</span>
              <span style={styles.statLabel}>Mengikuti</span>
            </div>
          </div>
        </div>

        {/* Bio & Details */}
        <div style={styles.bioSection}>
          <h3 style={styles.displayName}>{targetUser.displayName}</h3>
          <p style={styles.bioText}>{targetUser.bio}</p>

          {/* Interests Tags */}
          <div style={styles.interestsRow}>
            {targetUser.interests.map((interest) => (
              <span key={interest} style={styles.interestBadge}>#{interest}</span>
            ))}
          </div>
        </div>

        {/* Profile Action Buttons */}
        <div style={styles.actionButtons}>
          {isOwnProfile ? (
            <button onClick={() => setIsEditing(!isEditing)} className="btn-secondary" style={styles.fullWidthBtn}>
              {isEditing ? 'Batal' : 'Edit Profil'}
            </button>
          ) : (
            <button
              onClick={() => toggleFollowUser(targetUser.id)}
              className={isFollowing ? 'btn-outline' : 'btn-primary'}
              style={styles.fullWidthBtn}
            >
              {isFollowing ? 'Mengikuti' : 'Ikuti'}
            </button>
          )}
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <div style={styles.editCard}>
            <label style={styles.label}>Nama Tampilan</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={styles.input}
            />

            <label style={{ ...styles.label, marginTop: 8 }}>Bio</label>
            <input
              type="text"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              style={styles.input}
            />

            <button onClick={handleSaveProfile} className="btn-primary" style={{ marginTop: 12, width: '100%' }}>
              Simpan Profil
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div style={styles.tabBar}>
          <div style={styles.activeTabItem}>
            <Grid size={18} color="var(--text-primary)" />
          </div>
        </div>

        {/* Photo Grid */}
        <div style={styles.grid}>
          {userPosts.length === 0 ? (
            <div style={styles.emptyGrid}>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Belum ada postingan.</p>
            </div>
          ) : (
            userPosts.map((post) => (
              <div key={post.id} style={styles.gridItem}>
                <img src={post.imageUrl} alt={post.caption} style={styles.gridImg} loading="lazy" />
              </div>
            ))
          )}
        </div>
      </main>

      {/* Settings Modal (API Key Config) */}
      {showSettingsModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard} className="fade-in">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 8 }}>Pengaturan AI & Sistem</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 14 }}>
              Sosmet berjalan 100% tanpa API key menggunakan engine simulasi bawaan. Jika ingin mengaktifkan analisis gambar multimodal & komentar LLM via Google Gemini, masukkan API key di bawah.
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Gemini API Key (Opsional)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowSettingsModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                Batal
              </button>
              <button onClick={handleSaveApiKey} className="btn-primary" style={{ flex: 1 }}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-primary)',
    overflowY: 'auto'
  },
  header: {
    height: '52px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    backgroundColor: 'var(--bg-primary)',
    zIndex: 10
  },
  usernameHeader: {
    fontSize: '16px',
    fontWeight: '700'
  },
  iconBtn: {
    padding: '6px'
  },
  content: {
    padding: '16px'
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '14px'
  },
  avatarWrapper: {
    width: '76px',
    height: '76px'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  statsRow: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-around'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statNumber: {
    fontWeight: '700',
    fontSize: '16px'
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  bioSection: {
    marginBottom: '14px'
  },
  displayName: {
    fontSize: '14px',
    fontWeight: '700'
  },
  bioText: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    marginTop: '2px',
    lineHeight: '1.4'
  },
  interestsRow: {
    display: 'flex',
    gap: '6px',
    marginTop: '6px',
    flexWrap: 'wrap'
  },
  interestBadge: {
    fontSize: '11px',
    color: 'var(--accent-blue)',
    fontWeight: '600'
  },
  actionButtons: {
    marginBottom: '16px'
  },
  fullWidthBtn: {
    width: '100%',
    padding: '8px',
    fontSize: '13px'
  },
  editCard: {
    padding: '12px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    marginBottom: '16px',
    border: '1px solid var(--border-color)'
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    display: 'block'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-strong)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    outline: 'none'
  },
  tabBar: {
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'center'
  },
  activeTabItem: {
    padding: '10px 0',
    borderBottom: '2px solid var(--text-primary)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2px',
    marginTop: '2px'
  },
  gridItem: {
    position: 'relative',
    paddingTop: '100%',
    backgroundColor: '#111111'
  },
  gridImg: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  emptyGrid: {
    gridColumn: '1 / -1',
    padding: '40px 0',
    textAlign: 'center'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px'
  },
  modalCard: {
    width: '100%',
    maxWidth: '360px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    boxShadow: 'var(--shadow-modal)'
  }
};
