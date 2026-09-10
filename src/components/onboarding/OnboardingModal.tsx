import React, { useState } from 'react';
import { Camera, Check, ArrowRight } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';
import { Niche } from '../../types/sosmet';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
];

const AVAILABLE_NICHES: { id: Niche; label: string; icon: string }[] = [
  { id: 'coffee', label: 'Kopi & Kafe', icon: '☕' },
  { id: 'streetwear', label: 'Streetwear & Fit', icon: '👟' },
  { id: 'photography', label: 'Fotografi 35mm', icon: '📸' },
  { id: 'architecture', label: 'Arsitektur', icon: '🏛️' },
  { id: 'tech', label: 'Tech & Setup', icon: '💻' },
  { id: 'travel', label: 'Travel & Alam', icon: '🌿' },
  { id: 'minimalist', label: 'Minimalis', icon: '🤍' },
  { id: 'fitness', label: 'Fitness & Health', icon: '🧘‍♀️' },
  { id: 'art', label: 'Seni & Desain', icon: '🎨' },
  { id: 'lifestyle', label: 'Gaya Hidup', icon: '✨' }
];

export const OnboardingModal: React.FC = () => {
  const { completeOnboarding } = useSosmetStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState('naya.vibe');
  const [displayName, setDisplayName] = useState('Naya Rahma');
  const [bio, setBio] = useState('Menikmati momen kecil & kopi hangat ☕');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [selectedInterests, setSelectedInterests] = useState<Niche[]>(['coffee', 'lifestyle', 'photography']);

  const toggleInterest = (niche: Niche) => {
    if (selectedInterests.includes(niche)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== niche));
    } else {
      setSelectedInterests([...selectedInterests, niche]);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      username: username || 'pengguna',
      displayName: displayName || username || 'Pengguna',
      avatar: selectedAvatar,
      bio,
      interests: selectedInterests
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card} className="fade-in">
        {/* Progress header */}
        <div style={styles.header}>
          <h2 style={styles.brandTitle}>Sosmet</h2>
          <div style={styles.progressContainer}>
            <div style={{ ...styles.stepDot, backgroundColor: step >= 1 ? 'var(--text-primary)' : 'var(--border-strong)' }} />
            <div style={{ ...styles.stepDot, backgroundColor: step >= 2 ? 'var(--text-primary)' : 'var(--border-strong)' }} />
            <div style={{ ...styles.stepDot, backgroundColor: step >= 3 ? 'var(--text-primary)' : 'var(--border-strong)' }} />
          </div>
        </div>

        {/* Step 1: User details */}
        {step === 1 && (
          <div style={styles.stepContent}>
            <h3 style={styles.title}>Pilih Nama Profil Kamu</h3>
            <p style={styles.subtitle}>Bagaimana teman-teman di Sosmet mengenali kamu?</p>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="misal: naya.vibe"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Nama Tampilan</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="misal: Naya Rahma"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Bio Singkat</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ceritakan sedikit tentang dirimu..."
                style={styles.input}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!username.trim()}
              className="btn-primary"
              style={styles.nextBtn}
            >
              Lanjut <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </button>
          </div>
        )}

        {/* Step 2: Avatar Selection */}
        {step === 2 && (
          <div style={styles.stepContent}>
            <h3 style={styles.title}>Pilih Foto Profil</h3>
            <p style={styles.subtitle}>Gunakan foto realistis untuk pengalaman terbaik.</p>

            <div style={styles.avatarPreviewWrapper}>
              <img src={selectedAvatar} alt="Selected Avatar" style={styles.largeAvatar} />
            </div>

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
                  <img src={url} alt={`Avatar option ${idx}`} style={styles.avatarImg} />
                </button>
              ))}
            </div>

            <button onClick={() => setStep(3)} className="btn-primary" style={styles.nextBtn}>
              Lanjut <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </button>
          </div>
        )}

        {/* Step 3: Select Interests */}
        {step === 3 && (
          <div style={styles.stepContent}>
            <h3 style={styles.title}>Apa Minat Kamu?</h3>
            <p style={styles.subtitle}>Pilih topik yang suka kamu lihat di feed.</p>

            <div style={styles.nicheGrid}>
              {AVAILABLE_NICHES.map((niche) => {
                const isSelected = selectedInterests.includes(niche.id);
                return (
                  <button
                    key={niche.id}
                    onClick={() => toggleInterest(niche.id)}
                    style={{
                      ...styles.nicheChip,
                      backgroundColor: isSelected ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                      color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)'
                    }}
                  >
                    <span>{niche.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{niche.label}</span>
                    {isSelected && <Check size={14} style={{ marginLeft: 4 }} />}
                  </button>
                );
              })}
            </div>

            <button onClick={handleFinish} className="btn-primary" style={styles.nextBtn}>
              Masuk ke Sosmet ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px'
  },
  card: {
    width: '100%',
    maxWidth: '380px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-modal)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  brandTitle: {
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.5px'
  },
  progressContainer: {
    display: 'flex',
    gap: '6px'
  },
  stepDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.2s ease'
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '18px'
  },
  inputGroup: {
    marginBottom: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '12px',
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
  nextBtn: {
    marginTop: '16px',
    width: '100%',
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 'var(--radius-md)'
  },
  avatarPreviewWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  largeAvatar: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid var(--text-primary)'
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
    marginBottom: '10px'
  },
  avatarOption: {
    padding: 0,
    borderRadius: '50%',
    overflow: 'hidden',
    height: '48px',
    width: '48px'
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  nicheGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
    maxHeight: '220px',
    overflowY: 'auto'
  },
  nicheChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  }
};
