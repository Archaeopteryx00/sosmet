import React, { useState } from 'react';
import { Search, UserPlus, UserCheck } from 'lucide-react';
import { useSosmetStore } from '../../store/sosmetStore';
import { Niche } from '../../types/sosmet';

export const DiscoverView: React.FC = () => {
  const { posts, syntheticUsers, userProfile, relationships, toggleFollowUser, setSelectedProfileUser, setActiveTab } = useSosmetStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Niche | 'ALL'>('ALL');

  // Filter posts by search query or topic
  const explorePosts = posts.filter((p) => {
    if (selectedTopic !== 'ALL' && p.niche !== selectedTopic) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.caption.toLowerCase().includes(q) || p.username.toLowerCase().includes(q);
  });

  // Recommended accounts based on user interests
  const recommendedUsers = syntheticUsers.filter((u) => {
    const isInterestsMatch = u.interests.some((i) => userProfile.interests.includes(i));
    return isInterestsMatch;
  }).slice(0, 5);

  const handleUserClick = (u: any) => {
    setSelectedProfileUser(u);
    setActiveTab('PROFILE');
  };

  return (
    <div style={styles.container}>
      {/* Search Header */}
      <header style={styles.searchHeader}>
        <div style={styles.searchBar}>
          <Search size={16} color="var(--text-muted)" style={{ marginRight: 8 }} />
          <input
            type="text"
            placeholder="Cari postingan, topik, atau teman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </header>

      <main style={styles.content}>
        {/* Recommended Accounts Row */}
        {!searchQuery && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Rekomendasi Akun Untukmu</h3>
            <div style={styles.usersScroll}>
              {recommendedUsers.map((user) => {
                const relKey = `${userProfile.id}_${user.id}`;
                const isFollowing = relationships[relKey]?.isFollowing;

                return (
                  <div key={user.id} style={styles.userCard}>
                    <div style={styles.avatarWrapper} onClick={() => handleUserClick(user)}>
                      <img src={user.avatar} alt={user.username} style={styles.userAvatar} />
                    </div>
                    <span style={styles.userHandle} onClick={() => handleUserClick(user)}>
                      {user.username}
                    </span>
                    <span style={styles.userBioSnippet}>{user.bio}</span>
                    <button
                      onClick={() => toggleFollowUser(user.id)}
                      className={isFollowing ? 'btn-outline' : 'btn-primary'}
                      style={styles.followBtn}
                    >
                      {isFollowing ? 'Mengikuti' : 'Ikuti'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Photo Grid Header */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Jelajah Visual</h3>
          
          {/* Photo Grid */}
          <div style={styles.grid}>
            {explorePosts.map((post) => (
              <div key={post.id} style={styles.gridItem} onClick={() => handleUserClick(syntheticUsers.find(u => u.id === post.userId) || post)}>
                <img src={post.imageUrl} alt={post.caption} style={styles.gridImg} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      </main>
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
  searchHeader: {
    padding: '10px 14px',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    backgroundColor: 'var(--bg-primary)',
    zIndex: 10
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    fontSize: '13px',
    color: 'var(--text-primary)'
  },
  content: {
    padding: '12px 0'
  },
  section: {
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    padding: '0 14px 8px 14px',
    color: 'var(--text-primary)'
  },
  usersScroll: {
    display: 'flex',
    gap: '10px',
    padding: '0 14px',
    overflowX: 'auto'
  },
  userCard: {
    width: '130px',
    flexShrink: 0,
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  avatarWrapper: {
    cursor: 'pointer',
    marginBottom: '6px'
  },
  userAvatar: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  userHandle: {
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '2px',
    maxWidth: '110px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  userBioSnippet: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    height: '24px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  followBtn: {
    width: '100%',
    padding: '5px',
    fontSize: '11px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2px'
  },
  gridItem: {
    position: 'relative',
    paddingTop: '100%',
    backgroundColor: '#111111',
    cursor: 'pointer'
  },
  gridImg: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
};
