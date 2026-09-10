import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  User, 
  SyntheticUser, 
  Post, 
  Notification, 
  SimulationEvent, 
  SocialRelationship, 
  SimulationConfig, 
  NavigationTab,
  Niche,
  Comment
} from '../types/sosmet';
import { INITIAL_SYNTHETIC_USERS } from '../data/seedAccounts';
import { INITIAL_SEED_POSTS } from '../data/seedPosts';
import { runSimulationTick } from '../services/simulationEngine';
import { analyzeUserUploadedImage } from '../services/imageAnalyzer';
import { saveImageToStorage } from '../services/imageStorage';

interface SosmetState {
  userProfile: User;
  isOnboarded: boolean;

  syntheticUsers: SyntheticUser[];
  posts: Post[];
  notifications: Notification[];
  eventsLog: SimulationEvent[];
  relationships: Record<string, SocialRelationship>;

  activeTab: NavigationTab;
  selectedProfileUser: User | SyntheticUser | null;
  isDebugOpen: boolean;

  simulationConfig: SimulationConfig;

  // Actions
  completeOnboarding: (data: { username: string; displayName: string; avatar: string; bio: string; interests: Niche[] }) => void;
  updateUserProfile: (data: Partial<User>) => void;
  createPost: (imageUrl: string, caption: string, niche?: Niche) => Promise<void>;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleFollowUser: (targetUserId: string) => void;
  setActiveTab: (tab: NavigationTab) => void;
  setSelectedProfileUser: (user: User | SyntheticUser | null) => void;
  updateSimulationConfig: (config: Partial<SimulationConfig>) => void;
  toggleDebugDrawer: () => void;
  markNotificationsRead: () => void;
  triggerSimulationTick: () => Promise<void>;
  resetWorld: () => void;
}

const DEFAULT_USER: User = {
  id: 'user-me',
  username: 'kamu',
  displayName: 'Pengguna Sosmet',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: 'Baru saja bergabung di Sosmet 🌟',
  interests: ['lifestyle', 'photography', 'coffee'],
  followersCount: 12,
  followingCount: 8,
  postsCount: 0,
  isUser: true
};

export const useSosmetStore = create<SosmetState>()(
  persist(
    (set, get) => ({
      userProfile: DEFAULT_USER,
      isOnboarded: false,
      syntheticUsers: INITIAL_SYNTHETIC_USERS,
      posts: INITIAL_SEED_POSTS,
      notifications: [
        {
          id: 'n-init-1',
          recipientId: 'user-me',
          actorId: 'syn-1',
          actorUsername: 'naya_vibe',
          actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          type: 'follow',
          createdAt: Date.now() - 3600000,
          read: false
        }
      ],
      eventsLog: [],
      relationships: {},
      activeTab: 'HOME',
      selectedProfileUser: null,
      isDebugOpen: false,
      simulationConfig: {
        speed: 1,
        isPaused: false,
        totalTicks: 0,
        lastTickAt: Date.now(),
        aiApiKey: '',
        aiProvider: 'fallback'
      },

      completeOnboarding: (data) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            username: data.username.toLowerCase().trim(),
            displayName: data.displayName || data.username,
            avatar: data.avatar,
            bio: data.bio || 'Hadir di Sosmet.',
            interests: data.interests.length > 0 ? data.interests : ['lifestyle']
          },
          isOnboarded: true
        }));
      },

      updateUserProfile: (data) => {
        set((state) => ({
          userProfile: { ...state.userProfile, ...data }
        }));
      },

      createPost: async (imageUrl, caption, niche = 'lifestyle') => {
        const state = get();
        const now = Date.now();
        const postId = `post-user-${now}`;

        // Save large base64 image data to IndexedDB if applicable
        let finalImageUrl = imageUrl;
        if (imageUrl.startsWith('data:image/')) {
          const storageId = `img_id_${now}_${Math.random().toString(36).substr(2, 5)}`;
          await saveImageToStorage(storageId, imageUrl);
          finalImageUrl = storageId;
        }

        // Extract visual metadata
        const visualMetadata = await analyzeUserUploadedImage(
          imageUrl,
          caption,
          state.simulationConfig.aiApiKey
        );

        const newPost: Post = {
          id: postId,
          userId: state.userProfile.id,
          username: state.userProfile.username,
          userAvatar: state.userProfile.avatar,
          imageUrl: finalImageUrl,
          caption,
          createdAt: now,
          likesCount: 0,
          commentsCount: 0,
          niche,
          likedBy: [],
          comments: [],
          visualMetadata,
          isUserPost: true
        };

        set((s) => ({
          posts: [newPost, ...s.posts],
          userProfile: {
            ...s.userProfile,
            postsCount: s.userProfile.postsCount + 1
          },
          activeTab: 'HOME'
        }));
      },

      toggleLikePost: (postId) => {
        const userId = get().userProfile.id;
        set((state) => ({
          posts: state.posts.map((p) => {
            if (p.id !== postId) return p;
            const isLiked = p.likedBy.includes(userId);
            const newLikedBy = isLiked
              ? p.likedBy.filter((id) => id !== userId)
              : Array.from(new Set([...p.likedBy, userId]));

            return {
              ...p,
              likedBy: newLikedBy,
              likesCount: newLikedBy.length
            };
          })
        }));
      },

      addComment: (postId, text) => {
        const user = get().userProfile;
        const now = Date.now();
        const newComment: Comment = {
          id: `c-user-${now}`,
          postId,
          userId: user.id,
          username: user.username,
          userAvatar: user.avatar,
          text: text.trim(),
          createdAt: now
        };

        set((state) => ({
          posts: state.posts.map((p) => {
            if (p.id !== postId) return p;
            const newComments = [newComment, ...p.comments];
            return {
              ...p,
              comments: newComments,
              commentsCount: newComments.length
            };
          })
        }));
      },

      toggleFollowUser: (targetUserId) => {
        const currentUserId = get().userProfile.id;
        const relKey = `${currentUserId}_${targetUserId}`;

        set((state) => {
          const currentRel = state.relationships[relKey] || {
            sourceId: currentUserId,
            targetId: targetUserId,
            isFollowing: false,
            interactionCount: 0,
            relationshipStrength: 0.2
          };

          const newFollowing = !currentRel.isFollowing;
          const updatedRel = { ...currentRel, isFollowing: newFollowing };

          const updatedSyntheticUsers = state.syntheticUsers.map((u) => {
            if (u.id === targetUserId) {
              return {
                ...u,
                followersCount: newFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1)
              };
            }
            return u;
          });

          return {
            relationships: { ...state.relationships, [relKey]: updatedRel },
            userProfile: {
              ...state.userProfile,
              followingCount: newFollowing
                ? state.userProfile.followingCount + 1
                : Math.max(0, state.userProfile.followingCount - 1)
            },
            syntheticUsers: updatedSyntheticUsers
          };
        });
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      setSelectedProfileUser: (user) => set({ selectedProfileUser: user }),

      updateSimulationConfig: (config) =>
        set((state) => ({
          simulationConfig: { ...state.simulationConfig, ...config }
        })),

      toggleDebugDrawer: () => set((state) => ({ isDebugOpen: !state.isDebugOpen })),

      markNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true }))
        })),

      triggerSimulationTick: async () => {
        const state = get();
        if (state.simulationConfig.isPaused) return;

        const relMap = new Map<string, SocialRelationship>();
        Object.entries(state.relationships).forEach(([key, rel]) => relMap.set(key, rel));

        const tickResult = await runSimulationTick({
          syntheticUsers: state.syntheticUsers,
          userProfile: state.userProfile,
          posts: state.posts,
          relationships: relMap,
          apiKey: state.simulationConfig.aiApiKey
        });

        set((s) => {
          const postsMap = new Map(s.posts.map((p) => [p.id, p]));
          tickResult.updatedPosts.forEach((up) => {
            if (up.id && postsMap.has(up.id)) {
              postsMap.set(up.id, { ...postsMap.get(up.id)!, ...up });
            }
          });

          const newRelObj = { ...s.relationships };
          tickResult.updatedRelationships.forEach((rel) => {
            newRelObj[`${rel.sourceId}_${rel.targetId}`] = rel;
          });

          let userProfileUpdate = { ...s.userProfile };
          tickResult.updatedUsers.forEach((uStat) => {
            if (uStat.userId === s.userProfile.id && uStat.followersCount !== undefined) {
              userProfileUpdate.followersCount += 1;
            }
          });

          return {
            posts: Array.from(postsMap.values()),
            relationships: newRelObj,
            notifications: [...tickResult.newNotifications, ...s.notifications],
            eventsLog: [...tickResult.events, ...s.eventsLog].slice(0, 100),
            userProfile: userProfileUpdate,
            simulationConfig: {
              ...s.simulationConfig,
              totalTicks: s.simulationConfig.totalTicks + 1,
              lastTickAt: Date.now()
            }
          };
        });
      },

      resetWorld: () => {
        set({
          userProfile: DEFAULT_USER,
          isOnboarded: false,
          syntheticUsers: INITIAL_SYNTHETIC_USERS,
          posts: INITIAL_SEED_POSTS,
          notifications: [],
          eventsLog: [],
          relationships: {},
          activeTab: 'HOME',
          selectedProfileUser: null,
          simulationConfig: {
            speed: 1,
            isPaused: false,
            totalTicks: 0,
            lastTickAt: Date.now(),
            aiApiKey: '',
            aiProvider: 'fallback'
          }
        });
      }
    }),
    {
      name: 'sosmet-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userProfile: state.userProfile,
        isOnboarded: state.isOnboarded,
        syntheticUsers: state.syntheticUsers,
        posts: state.posts,
        notifications: state.notifications,
        relationships: state.relationships,
        simulationConfig: state.simulationConfig
      })
    }
  )
);
