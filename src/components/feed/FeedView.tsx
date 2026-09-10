import React, { useState } from 'react';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';
import { PostCard } from './PostCard';
import { Niche } from '../../types/sosmet';

export const FeedView: React.FC = () => {
  const { posts, userProfile, triggerSimulationTick } = useSosmetStore();
  const [selectedNiche, setSelectedNiche] = useState<Niche | 'ALL'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await triggerSimulationTick();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filter & rank posts
  const filteredPosts = posts.filter((p) => {
    if (selectedNiche === 'ALL') return true;
    return p.niche === selectedNiche;
  });

  // Rank posts considering user interests & recency
  const rankedPosts = [...filteredPosts].sort((a, b) => {
    const aIsInterest = userProfile.interests.includes(a.niche) ? 1.3 : 1.0;
    const bIsInterest = userProfile.interests.includes(b.niche) ? 1.3 : 1.0;
    
    const aScore = (a.createdAt / 100000) * aIsInterest + (a.likesCount * 2);
    const bScore = (b.createdAt / 100000) * bIsInterest + (b.likesCount * 2);

    return bScore - aScore;
  });

  return (
    <div style={styles.container}>
      {/* Header Bar */}
      <header style={styles.topHeader}>
        <h1 style={styles.logoTitle}>Sosmet</h1>
        <div style={styles.headerRight}>
          <button 
            onClick={handleRefresh} 
            style={{ 
              ...styles.headerBtn, 
              transform: isRefreshing ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.5s ease' 
            }}
            aria-label="Refresh Feed"
          >
            <RefreshCw size={20} color="var(--text-primary)" />
          </button>
        </div>
      </header>

      {/* Filter Chips */}
      <div style={styles.filterBar}>
        <button
          onClick={() => setSelectedNiche('ALL')}
          style={{
            ...styles.chip,
            backgroundColor: selectedNiche === 'ALL' ? 'var(--text-primary)' : 'var(--bg-tertiary)',
            color: selectedNiche === 'ALL' ? 'var(--bg-primary)' : 'var(--text-primary)'
          }}
        >
          Semua
        </button>
        {userProfile.interests.map((interest) => (
          <button
            key={interest}
            onClick={() => setSelectedNiche(interest)}
            style={{
              ...styles.chip,
              backgroundColor: selectedNiche === interest ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              color: selectedNiche === interest ? 'var(--bg-primary)' : 'var(--text-primary)'
            }}
          >
            {interest}
          </button>
        ))}
      </div>

      {/* Posts Timeline */}
      <main style={styles.feedContent}>
        {rankedPosts.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontWeight: 600, fontSize: '15px' }}>Belum ada postingan di kategori ini.</p>            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: 4 }}>Jadilah yang pertama mengupload!</p>
          </div>
        ) : (
          rankedPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'var(--bg-primary)',
    overflowY: 'auto'
  },
  topHeader: {
    height: '52px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  logoTitle: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    fontFamily: "'Inter', sans-serif"
  },
  headerRight: {
    display: 'flex',
    gap: '12px'
  },
  headerBtn: {
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    padding: '10px 14px',
    overflowX: 'auto',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)'
  },
  chip: {
    padding: '5px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    border: 'none',
    cursor: 'pointer'
  },
  feedContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center'
  }
};
