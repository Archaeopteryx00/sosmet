import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Post } from '../../types/sosmet';
import { useSosmetStore } from '../../store/sosmetStore';
import { SosmetImage } from '../common/SosmetImage';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { userProfile, syntheticUsers, toggleLikePost, addComment, setSelectedProfileUser, setActiveTab } = useSosmetStore();
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  const isLikedByMe = post.likedBy.includes(userProfile.id);

  const handleImageDoubleClick = () => {
    if (!isLikedByMe) {
      toggleLikePost(post.id);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 800);
  };

  const handleUserClick = () => {
    if (post.userId === userProfile.id) {
      setSelectedProfileUser(null);
    } else {
      const synUser = syntheticUsers.find((u) => u.id === post.userId);
      if (synUser) {
        setSelectedProfileUser(synUser);
      }
    }
    setActiveTab('PROFILE');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const formatTimeAgo = (timestamp: number) => {
    const diffInMinutes = Math.floor((Date.now() - timestamp) / 60000);
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} mnt`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} j`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} h`;
  };

  return (
    <article style={styles.card}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.userInfo} onClick={handleUserClick}>
          <div className="avatar-ring-none" style={{ width: 36, height: 36, overflow: 'hidden', borderRadius: '50%' }}>
            <SosmetImage src={post.userAvatar} alt={post.username} className="avatar-img" />
          </div>
          <div style={styles.userText}>
            <span style={styles.username}>{post.username}</span>
            {post.niche && <span style={styles.nicheBadge}>• {post.niche}</span>}
          </div>
        </div>
        <button style={styles.iconBtn} aria-label="Menu Opsional">
          <MoreHorizontal size={18} color="var(--text-secondary)" />
        </button>
      </header>

      {/* Main Image using SosmetImage */}
      <div style={styles.imageContainer} onDoubleClick={handleImageDoubleClick}>
        <SosmetImage src={post.imageUrl} alt={post.caption || 'Post image'} style={styles.image} />
        {showHeartPop && (
          <div style={styles.heartPopOverlay}>
            <Heart size={80} fill="#ffffff" color="#ffffff" className="heart-pop" />
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div style={styles.actionsBar}>
        <div style={styles.leftActions}>
          <button 
            onClick={() => toggleLikePost(post.id)} 
            style={styles.iconBtn}
            aria-label={isLikedByMe ? "Batal Suka" : "Suka"}
          >
            <Heart 
              size={24} 
              fill={isLikedByMe ? 'var(--accent-red)' : 'none'} 
              color={isLikedByMe ? 'var(--accent-red)' : 'var(--text-primary)'} 
              strokeWidth={isLikedByMe ? 0 : 1.8}
            />
          </button>
          <button 
            onClick={() => setIsCommentsExpanded(!isCommentsExpanded)} 
            style={styles.iconBtn}
            aria-label="Lihat Komentar"
          >
            <MessageCircle size={24} color="var(--text-primary)" strokeWidth={1.8} />
          </button>
          <button style={styles.iconBtn} aria-label="Bagikan">
            <Send size={22} color="var(--text-primary)" strokeWidth={1.8} />
          </button>
        </div>
        <button style={styles.iconBtn} aria-label="Simpan">
          <Bookmark size={23} color="var(--text-primary)" strokeWidth={1.8} />
        </button>
      </div>

      {/* Likes Count */}
      <div style={styles.likesSection}>
        <span style={styles.likesText}>
          {post.likesCount === 0 ? (
            'Jadilah yang pertama menyukai'
          ) : isLikedByMe ? (
            `Disukai oleh kamu${post.likesCount > 1 ? ` dan ${post.likesCount - 1} lainnya` : ''}`
          ) : (
            `Disukai oleh ${post.likesCount} orang`
          )}
        </span>
      </div>

      {/* Caption */}
      {post.caption && (
        <div style={styles.captionSection}>
          <span style={styles.captionUsername} onClick={handleUserClick}>{post.username}</span>
          <span style={styles.captionText}>{post.caption}</span>
        </div>
      )}

      {/* Comments Section */}
      <div style={styles.commentsSection}>
        {post.commentsCount > 0 && !isCommentsExpanded && (
          <button 
            onClick={() => setIsCommentsExpanded(true)}
            style={styles.viewCommentsBtn}
          >
            Lihat semua {post.commentsCount} komentar
          </button>
        )}

        {(isCommentsExpanded ? post.comments : post.comments.slice(0, 2)).map((comment) => (
          <div key={comment.id} style={styles.commentRow}>
            <span style={styles.commentUsername}>{comment.username}</span>
            <span style={styles.commentText}>{comment.text}</span>
          </div>
        ))}
      </div>

      {/* Timestamp */}
      <div style={styles.timestampSection}>
        <span style={styles.timestampText}>{formatTimeAgo(post.createdAt)} lalu</span>
      </div>

      {/* Quick Add Comment Form */}
      <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
        <input
          type="text"
          placeholder="Tambahkan komentar..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={styles.commentInput}
        />
        {commentText.trim() && (
          <button type="submit" style={styles.postCommentBtn}>Kirim</button>
        )}
      </form>
    </article>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--bg-primary)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  },
  userText: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  username: {
    fontWeight: '600',
    fontSize: '13px',
    color: 'var(--text-primary)'
  },
  nicheBadge: {
    fontSize: '11px',
    color: 'var(--text-muted)'
  },
  iconBtn: {
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#e4e4e7',
    userSelect: 'none',
    cursor: 'pointer'
  },
  image: {
    width: '100%',
    maxHeight: '520px',
    objectFit: 'cover',
    display: 'block'
  },
  heartPopOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 5
  },
  actionsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px 6px 14px'
  },
  leftActions: {
    display: 'flex',
    gap: '14px'
  },
  likesSection: {
    padding: '0 14px 4px 14px'
  },
  likesText: {
    fontWeight: '600',
    fontSize: '13px',
    color: 'var(--text-primary)'
  },
  captionSection: {
    padding: '2px 14px 6px 14px',
    lineHeight: '1.4'
  },
  captionUsername: {
    fontWeight: '600',
    fontSize: '13px',
    marginRight: '6px',
    cursor: 'pointer'
  },
  captionText: {
    fontSize: '13px',
    color: 'var(--text-primary)'
  },
  commentsSection: {
    padding: '0 14px 4px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  viewCommentsBtn: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    textAlign: 'left',
    padding: '2px 0',
    marginBottom: '2px'
  },
  commentRow: {
    fontSize: '12px',
    lineHeight: '1.3'
  },
  commentUsername: {
    fontWeight: '600',
    marginRight: '6px'
  },
  commentText: {
    color: 'var(--text-primary)'
  },
  timestampSection: {
    padding: '2px 14px 8px 14px'
  },
  timestampText: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  commentForm: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 14px',
    borderTop: '1px solid var(--border-color)'
  },
  commentInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    color: 'var(--text-primary)'
  },
  postCommentBtn: {
    color: 'var(--accent-blue)',
    fontWeight: '600',
    fontSize: '13px',
    marginLeft: '8px'
  }
};
