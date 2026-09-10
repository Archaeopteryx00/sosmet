import React, { useState, useRef } from 'react';
import { Camera, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';
import { Niche } from '../../types/sosmet';

const SAMPLE_UPLOADS = [
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
];

const NICHES: { id: Niche; label: string }[] = [
  { id: 'coffee', label: '☕ Kopi' },
  { id: 'streetwear', label: '👟 Streetwear' },
  { id: 'photography', label: '📸 Fotografi' },
  { id: 'architecture', label: '🏛️ Arsitektur' },
  { id: 'tech', label: '💻 Tech' },
  { id: 'travel', label: '🌿 Travel' },
  { id: 'minimalist', label: '🤍 Minimalis' },
  { id: 'fitness', label: '🧘‍♀️ Fitness' },
  { id: 'art', label: '🎨 Art' },
  { id: 'lifestyle', label: '✨ Lifestyle' }
];

export const CreatePostModal: React.FC = () => {
  const { createPost, setActiveTab } = useSosmetStore();
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_UPLOADS[0]);
  const [caption, setCaption] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<Niche>('coffee');
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!selectedImage) return;
    setIsPublishing(true);
    await createPost(selectedImage, caption, selectedNiche);
    setIsPublishing(false);
  };

  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <header style={styles.header}>
        <button onClick={() => setActiveTab('HOME')} style={styles.cancelBtn}>
          Batal
        </button>
        <h2 style={styles.headerTitle}>Postingan Baru</h2>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          style={styles.publishBtn}
        >
          {isPublishing ? 'Mengupload...' : 'Bagikan'}
        </button>
      </header>

      {/* Main Content */}
      <main style={styles.content}>
        {/* Photo Preview */}
        <div style={styles.previewContainer}>
          <img src={selectedImage} alt="Post Preview" style={styles.previewImage} />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={styles.changePhotoBtn}
          >
            <Camera size={16} style={{ marginRight: 6 }} /> Ganti Foto
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        {/* Preset Sample Selector */}
        <div style={styles.presetSection}>
          <span style={styles.sectionLabel}>Atau Pilih Foto Sampel:</span>
          <div style={styles.sampleGrid}>
            {SAMPLE_UPLOADS.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`Sample ${idx}`}
                onClick={() => setSelectedImage(imgUrl)}
                style={{
                  ...styles.sampleThumb,
                  border: selectedImage === imgUrl ? '2px solid var(--text-primary)' : '2px solid transparent'
                }}
              />
            ))}
          </div>
        </div>

        {/* Caption Field */}
        <div style={styles.captionGroup}>
          <label style={styles.sectionLabel}>Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Tulis caption postingan kamu..."
            rows={3}
            style={styles.textarea}
          />
        </div>

        {/* Niche Category Picker */}
        <div style={styles.nicheGroup}>
          <label style={styles.sectionLabel}>Kategori / Niche</label>
          <div style={styles.nicheRow}>
            {NICHES.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNiche(n.id)}
                style={{
                  ...styles.nicheBtn,
                  backgroundColor: selectedNiche === n.id ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                  color: selectedNiche === n.id ? 'var(--bg-primary)' : 'var(--text-primary)'
                }}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-primary)'
  },
  header: {
    height: '52px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)'
  },
  cancelBtn: {
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: '700'
  },
  publishBtn: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--accent-blue)'
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px'
  },
  previewContainer: {
    width: '100%',
    height: '280px',
    backgroundColor: '#111111',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '16px'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center'
  },
  presetSection: {
    marginBottom: '16px'
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    display: 'block'
  },
  sampleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px'
  },
  sampleThumb: {
    width: '100%',
    height: '64px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer'
  },
  captionGroup: {
    marginBottom: '16px'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-strong)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'none'
  },
  nicheGroup: {
    marginBottom: '20px'
  },
  nicheRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  nicheBtn: {
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer'
  }
};
