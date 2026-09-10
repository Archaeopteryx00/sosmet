import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
];

export const OnboardingModal: React.FC = () => {
  const { completeOnboarding } = useSosmetStore();
  const [username, setUsername] = useState('naya.vibe');
  const [displayName, setDisplayName] = useState('Naya Rahma');
  const [bio, setBio] = useState('Menikmati momen kecil & kopi hangat ☕');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);

  const handleFinish = () => {
    completeOnboarding({
      username: username || 'pengguna',
      displayName: displayName || username || 'Pengguna',
      avatar: selectedAvatar,
      bio
    });
  };

  return (
    <div style={styles.fullscreenOverlay}>
      <div style={styles.card} className="fade-in">
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.brandTitle}>Sosmet</h2>
          <span style={styles.subtitleBadge}>Selamat Datang</span>
        </div>

        <p style={styles.subtitle}>
          Siapkan profil singkat kamu atau langsung masuk untuk menikmati feed.
        </p>

        {/* Profile Details */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username & Nama Tampilan (Opsional)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="misal: naya.vibe"
            style={styles.input}
          />
        </div>

        {/* Avatar Picker */}
        <div style={styles.avatarSection}>
          <label style={styles.label}>Pilih Foto Profil (Opsional)</label>
          <div style={styles.avatarGrid}>
            {PRESET_AVATARS.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAvatar(url)}
                style={{
                  ...styles.avatarOption,
                  border: selectedAvatar === url ? '2px solid var(--text-primary)' : '2px solid transparent'
                }}
              >
                <img src={url} alt={`Avatar ${idx}`} style={styles.avatarImg} />
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Bio (Opsional)</label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Ceritakan sedikit tentang kamu..."
            style={styles.input}
          />
        </div>

        {/* Action Button */}
        <button onClick={handleFinish} className="btn-primary" style={styles.enterBtn}>
          Masuk ke Sosmet <ArrowRight size={16} style={{ marginLeft: 6 }} />
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px'
  },
  card: {
    width: '100%',
    maxWidth: '360px',
    backgroundColor: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  brandTitle: {
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  subtitleBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)'
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
    lineHeight: '1.4'
  },
  inputGroup: {
    marginBottom: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  },
  input: {
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-strong)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none'
  },
  avatarSection: {
    marginBottom: '14px'
  },
  avatarGrid: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
    overflowX: 'auto',
    paddingBottom: '4px'
  },
  avatarOption: {
    padding: 0,
    borderRadius: '50%',
    overflow: 'hidden',
    height: '44px',
    width: '44px',
    flexShrink: 0
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  enterBtn: {
    marginTop: '12px',
    width: '100%',
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px'
  }
};
