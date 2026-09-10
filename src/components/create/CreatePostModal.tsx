import React, { useState, useRef } from 'react';
import { Camera, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';
import { Niche } from '../../types/sosmet';

const SAMPLE_POST_TYPES: { id: Niche; label: string; url: string; defaultCaption: string }[] = [
  {
    id: 'lifestyle',
    label: 'Selfie Biasa',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    defaultCaption: 'casual Sunday afternoon 🌤️'
  },
  {
    id: 'coffee',
    label: 'Makanan / Kopi',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    defaultCaption: 'avocado toast + iced americano 🥑☕'
  },
  {
    id: 'travel',
    label: 'Pemandangan',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    defaultCaption: 'vitamin sea 🌊 clear water, clear mind'
  },
  {
    id: 'streetwear',
    label: 'Outfit',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    defaultCaption: 'weekend fit check 👟 vintage oversized tee'
  },
  {
    id: 'tech',
    label: 'Foto Random / Objek',
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    defaultCaption: 'late night debugging setup 💻 custom keyb'
  }
];

export const CreatePostModal: React.FC = () => {
  const { createPost, setActiveTab } = useSosmetStore();
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_POST_TYPES[0].url);
  const [caption, setCaption] = useState(SAMPLE_POST_TYPES[0].defaultCaption);
  const [selectedNiche, setSelectedNiche] = useState<Niche>(SAMPLE_POST_TYPES[0].id);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectSample = (sample: typeof SAMPLE_POST_TYPES[0]) => {
    setSelectedImage(sample.url);
    setCaption(sample.defaultCaption);
    setSelectedNiche(sample.id);
  };

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
            <Camera size={16} style={{ marginRight: 6 }} /> Ganti Foto (Galeri/Kamera)
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        {/* Preset Post Types */}
        <div style={styles.presetSection}>
          <span style={styles.sectionLabel}>Atau Pilih Tipe Foto Sampel:</span>
          <div style={styles.sampleGrid}>
            {SAMPLE_POST_TYPES.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSample(sample)}
                style={{
                  ...styles.sampleCard,
                  border: selectedImage === sample.url ? '2px solid var(--text-primary)' : '1px solid var(--border-color)'
                }}
              >
                <img src={sample.url} alt={sample.label} style={styles.sampleThumb} />
                <span style={styles.sampleLabel}>{sample.label}</span>
              </div>
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
    height: '260px',
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
    backgroundColor: 'rgba(0,0,0,0.75)',
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
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '6px'
  },
  sampleCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--bg-secondary)',
    cursor: 'pointer'
  },
  sampleThumb: {
    width: '100%',
    height: '48px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '4px'
  },
  sampleLabel: {
    fontSize: '10px',
    fontWeight: '600',
    textAlign: 'center',
    color: 'var(--text-primary)',
    lineHeight: '1.2'
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
  }
};
