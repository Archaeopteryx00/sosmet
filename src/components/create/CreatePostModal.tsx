import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';

const SAMPLE_POST_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
];

export const CreatePostModal: React.FC = () => {
  const { createPost, setActiveTab } = useSosmetStore();
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_POST_PHOTOS[0]);
  const [caption, setCaption] = useState('');
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
    // AI Vision analysis extracts internal visual metadata automatically without user category prompt
    await createPost(selectedImage, caption);
    setIsPublishing(false);
  };

  return (
    <div style={styles.container}>
      {/* Top Header */}
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

      {/* Main Form */}
      <main style={styles.content}>
        {/* Photo Container */}
        <div style={styles.previewContainer}>
          <img src={selectedImage} alt="Post Preview" style={styles.previewImage} />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={styles.changePhotoBtn}
          >
            <Camera size={16} style={{ marginRight: 6 }} /> Pilih Foto (Galeri / Kamera)
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        {/* Optional Caption Input */}
        <div style={styles.captionGroup}>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Tulis caption... (opsional)"
            rows={3}
            style={styles.textarea}
          />
        </div>

        {/* Subtle Sample Selector Fallback */}
        <div style={styles.sampleSection}>
          <span style={styles.sampleLabel}>Atau pilih foto galeri sampel:</span>
          <div style={styles.sampleRow}>
            {SAMPLE_POST_PHOTOS.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Sample ${idx}`}
                onClick={() => setSelectedImage(url)}
                style={{
                  ...styles.sampleThumb,
                  border: selectedImage === url ? '2px solid var(--text-primary)' : '1px solid var(--border-color)'
                }}
              />
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
    height: '320px',
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
    padding: '8px 14px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center'
  },
  captionGroup: {
    marginBottom: '20px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-strong)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'none'
  },
  sampleSection: {
    marginTop: '10px'
  },
  sampleLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    display: 'block'
  },
  sampleRow: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto'
  },
  sampleThumb: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    flexShrink: 0
  }
};
