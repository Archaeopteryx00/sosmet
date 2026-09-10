import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';
import { PostCard } from './PostCard';

export const FeedView: React.FC = () => {
  const { posts, userProfile, triggerSimulationTick } = useSosmetStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await triggerSimulationTick();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Algorithmic feed ranking based on implicit user interests, relationship strength & recency
  const rankedPosts = [...posts].sort((a, b) => {
    const aIsInterest = userProfile.interests.includes(a.niche) ? 1.35 : 1.0;
    const bIsInterest = userProfile.interests.includes(b.niche) ? 1.35 : 1.0;
    
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

      {/* Timeline Feed */}
      <main style={styles.feedContent}>
        {rankedPosts.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontWeight: 600, fontSize: '15px' }}>Belum ada postingan di feed.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: 4 }}>Bagikan foto pertama kamu!</p>
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
  feedContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '20px'
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center'
  }
};
