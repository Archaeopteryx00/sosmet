export type Niche = 
  | 'streetwear'
  | 'coffee'
  | 'architecture'
  | 'tech'
  | 'travel'
  | 'minimalist'
  | 'fitness'
  | 'art'
  | 'photography'
  | 'lifestyle';

export type UserArchetype = 
  | 'lurker'
  | 'active'
  | 'creator'
  | 'niche'
  | 'social'
  | 'casual';

export interface VisualMetadata {
  content_type: string;
  scene: string;
  subjects: string[];
  mood: string;
  visual_style: string;
  objects: string[];
  outfit?: string[];
  possible_topics: string[];
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  interests: Niche[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isUser: boolean;
}

export interface SyntheticUser extends User {
  niche: Niche;
  archetype: UserArchetype;
  activityLevel: number; // 0.1 to 1.0
  postingFrequency: number; // 0.0 to 1.0
  engagementTendency: {
    likeProbability: number;
    commentProbability: number;
    followProbability: number;
    profileVisitProbability: number;
  };
  preferredTopics: string[];
  commentStyle: 'short' | 'emoji' | 'casual' | 'opinionated' | 'questioning';
  lastActiveTimestamp: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  createdAt: number;
  likesCount: number;
  commentsCount: number;
  niche: Niche;
  likedBy: string[]; // userIds
  comments: Comment[];
  visualMetadata?: VisualMetadata;
  isUserPost?: boolean;
}

export interface SocialRelationship {
  sourceId: string;
  targetId: string;
  isFollowing: boolean;
  interactionCount: number;
  relationshipStrength: number; // 0.0 to 1.0
  lastInteractionAt?: number;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'profile_visit';

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string;
  actorUsername: string;
  actorAvatar: string;
  type: NotificationType;
  postId?: string;
  commentText?: string;
  createdAt: number;
  read: boolean;
}

export interface SimulationEvent {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'profile_visit' | 'post';
  actorId: string;
  targetId: string; // userId or postId
  timestamp: number;
  description: string;
}

export interface SimulationConfig {
  speed: number; // 1 = realtime, 5 = 5x, etc.
  isPaused: boolean;
  totalTicks: number;
  lastTickAt: number;
  aiApiKey?: string;
  aiProvider: 'gemini' | 'groq' | 'fallback';
}

export type NavigationTab = 'HOME' | 'DISCOVER' | 'CREATE' | 'ACTIVITY' | 'PROFILE';
