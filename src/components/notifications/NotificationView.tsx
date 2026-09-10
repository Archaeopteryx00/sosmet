import React, { useEffect } from 'react';
import { useSosmetStore } from '../../store/sosmetStore';
import { SosmetImage } from '../common/SosmetImage';

export const NotificationView: React.FC = () => {
  const { notifications, markNotificationsRead, posts, setSelectedProfileUser, syntheticUsers, setActiveTab } = useSosmetStore();

  useEffect(() => {
    markNotificationsRead();
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const diffInMinutes = Math.floor((Date.now() - timestamp) / 60000);
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}j`;
    return `${Math.floor(diffInHours / 24)}h`;
  };

  const handleActorClick = (actorId: string) => {
    const user = syntheticUsers.find((u) => u.id === actorId);
    if (user) {
      setSelectedProfileUser(user);
      setActiveTab('PROFILE');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Aktivitas</h2>
      </header>

      <main style={styles.content}>
        {notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontWeight: 600 }}>Belum ada aktivitas baru.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: 4 }}>
              Saat teman-teman di Sosmet menyukai atau mengomentari postinganmu, notifikasinya akan muncul di sini.
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {notifications.map((notif) => {
              const relatedPost = posts.find((p) => p.id === notif.postId);

              return (
                <div key={notif.id} style={styles.row}>
                  <div style={styles.avatarWrapper} onClick={() => handleActorClick(notif.actorId)}>
                    <SosmetImage src={notif.actorAvatar} alt={notif.actorUsername} style={styles.avatar} />
                  </div>

                  <div style={styles.textContainer}>
                    <span 
                      style={styles.actorName} 
                      onClick={() => handleActorClick(notif.actorId)}
                    >
                      {notif.actorUsername}
                    </span>{' '}
                    <span style={styles.actionText}>
                      {notif.type === 'like' && 'menyukai postingan kamu.'}
                      {notif.type === 'comment' && `mengomentari: "${notif.commentText}"`}
                      {notif.type === 'follow' && 'mulai mengikuti kamu.'}
                      {notif.type === 'profile_visit' && 'mengunjungi profil kamu.'}
                    </span>{' '}
                    <span style={styles.time}>{formatTimeAgo(notif.createdAt)}</span>
                  </div>

                  {relatedPost && (notif.type === 'like' || notif.type === 'comment') && (
                    <div style={styles.postThumbWrapper}>
                      <SosmetImage src={relatedPost.imageUrl} alt="Post thumbnail" style={styles.postThumb} />
                    </div>
                  )}

                  {notif.type === 'follow' && (
                    <button className="btn-outline" style={{ fontSize: '12px', padding: '4px 10px' }}>
                      Mengikuti
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
  header: {
    height: '52px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    backgroundColor: 'var(--bg-primary)',
    zIndex: 10
  },
  title: {
    fontSize: '18px',
    fontWeight: '700'
  },
  content: {
    flex: 1
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center'
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    gap: '12px',
    borderBottom: '1px solid var(--border-color)'
  },
  avatarWrapper: {
    cursor: 'pointer',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    overflow: 'hidden'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  textContainer: {
    flex: 1,
    fontSize: '13px',
    lineHeight: '1.4'
  },
  actorName: {
    fontWeight: '700',
    cursor: 'pointer'
  },
  actionText: {
    color: 'var(--text-primary)'
  },
  time: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginLeft: '4px'
  },
  postThumbWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden'
  },
  postThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
};
