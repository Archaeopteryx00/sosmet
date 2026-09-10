import { SyntheticUser, Post, SocialRelationship, SimulationEvent, Notification } from '../types/sosmet';
import { generateSyntheticComment } from './aiCommentGenerator';

export interface SimulationTickResult {
  events: SimulationEvent[];
  newPosts: Post[];
  updatedPosts: Partial<Post>[];
  newNotifications: Notification[];
  updatedUsers: { userId: string; followersCount?: number; followingCount?: number }[];
  updatedRelationships: SocialRelationship[];
}

/**
 * Calculates time decay factor for a post based on age.
 * Fresh posts (<2h) have high engagement potential.
 * Posts >24h decay significantly, but occasionally resurface.
 */
function calculateTimeDecay(postCreatedAt: number, now: number): number {
  const ageInHours = (now - postCreatedAt) / (1000 * 3600);
  if (ageInHours < 2) return 1.2;
  if (ageInHours < 6) return 1.0;
  if (ageInHours < 12) return 0.7;
  if (ageInHours < 24) return 0.4;
  if (ageInHours < 48) return 0.15;
  // 5% chance of resurfacing older post
  return Math.random() < 0.05 ? 0.3 : 0.05;
}

/**
 * Calculates topic relevance between user interests & post niche/visual metadata.
 */
function calculateRelevance(user: SyntheticUser, post: Post): number {
  if (user.interests.includes(post.niche)) return 1.4;
  const postTopics = post.visualMetadata?.possible_topics || [];
  const matches = user.preferredTopics.filter(t => postTopics.includes(t));
  if (matches.length > 0) return 1.2;
  return 0.7;
}

/**
 * Time of day activity multiplier (low late at night: 1am-6am).
 */
function calculateTimeOfDayMultiplier(): number {
  const hour = new Date().getHours();
  if (hour >= 1 && hour <= 6) return 0.25;
  if (hour >= 7 && hour <= 9) return 0.8;
  if (hour >= 12 && hour <= 14) return 1.1;
  if (hour >= 19 && hour <= 23) return 1.3;
  return 1.0;
}

export async function runSimulationTick(params: {
  syntheticUsers: SyntheticUser[];
  userProfile: { id: string; username: string; avatar: string; isUser: boolean };
  posts: Post[];
  relationships: Map<string, SocialRelationship>;
  apiKey?: string;
}): Promise<SimulationTickResult> {
  const { syntheticUsers, userProfile, posts, relationships, apiKey } = params;
  const now = Date.now();
  const timeOfDayMult = calculateTimeOfDayMultiplier();

  const events: SimulationEvent[] = [];
  const newPosts: Post[] = [];
  const updatedPostsMap = new Map<string, Post>();
  const newNotifications: Notification[] = [];
  const userStatUpdates = new Map<string, { followersCount?: number; followingCount?: number }>();
  const updatedRelationships: SocialRelationship[] = [];

  // Pick a random subset of 3-7 active synthetic users for this tick
  const numActiveThisTick = Math.min(syntheticUsers.length, Math.floor(Math.random() * 5) + 3);
  const shuffledUsers = [...syntheticUsers].sort(() => 0.5 - Math.random());
  const activeUsersThisTick = shuffledUsers.slice(0, numActiveThisTick);

  for (const actor of activeUsersThisTick) {
    // Skip if user is lurker and random check fails
    const effectiveActivity = actor.activityLevel * timeOfDayMult;
    if (Math.random() > effectiveActivity) continue;

    // Pick 1-2 posts from the feed for this actor to view/interact with
    const availablePosts = [...posts].sort(() => 0.5 - Math.random()).slice(0, 3);

    for (const targetPost of availablePosts) {
      // Don't interact with own posts
      if (targetPost.userId === actor.id) continue;

      const isAlreadyLiked = targetPost.likedBy.includes(actor.id);
      const relKey = `${actor.id}_${targetPost.userId}`;
      const rel = relationships.get(relKey) || {
        sourceId: actor.id,
        targetId: targetPost.userId,
        isFollowing: false,
        interactionCount: 0,
        relationshipStrength: 0.1
      };

      const timeDecay = calculateTimeDecay(targetPost.createdAt, now);
      const relevance = calculateRelevance(actor, targetPost);

      // --- 1. LIKE SIMULATION ---
      const pLike = actor.engagementTendency.likeProbability * 
        relevance * 
        (1 + rel.relationshipStrength) * 
        timeDecay * 
        (0.8 + Math.random() * 0.4);

      if (!isAlreadyLiked && Math.random() < pLike) {
        // Actor likes the post!
        let postToUpdate = updatedPostsMap.get(targetPost.id) || { ...targetPost };
        postToUpdate = {
          ...postToUpdate,
          likesCount: postToUpdate.likesCount + 1,
          likedBy: [...postToUpdate.likedBy, actor.id]
        };
        updatedPostsMap.set(targetPost.id, postToUpdate);

        // Update relationship
        rel.interactionCount += 1;
        rel.relationshipStrength = Math.min(1.0, rel.relationshipStrength + 0.1);
        relationships.set(relKey, rel);
        updatedRelationships.push(rel);

        events.push({
          id: `evt-like-${now}-${Math.random()}`,
          type: 'like',
          actorId: actor.id,
          targetId: targetPost.id,
          timestamp: now,
          description: `@${actor.username} menyukai postingan @${targetPost.username}`
        });

        // Notify post creator if it's the real user
        if (targetPost.userId === userProfile.id) {
          newNotifications.push({
            id: `notif-${now}-${Math.random()}`,
            recipientId: userProfile.id,
            actorId: actor.id,
            actorUsername: actor.username,
            actorAvatar: actor.avatar,
            type: 'like',
            postId: targetPost.id,
            createdAt: now,
            read: false
          });
        }
      }

      // --- 2. COMMENT SIMULATION ---
      const pComment = actor.engagementTendency.commentProbability * 
        relevance * 
        timeDecay * 
        (0.7 + Math.random() * 0.5);

      const alreadyCommentedByActor = targetPost.comments.some(c => c.userId === actor.id);

      if (!alreadyCommentedByActor && Math.random() < pComment) {
        // Generate natural comment via AI generator (or fallback)
        const commentText = await generateSyntheticComment(
          {
            commenter: actor,
            post: targetPost,
            visualMetadata: targetPost.visualMetadata,
            relationshipStrength: rel.relationshipStrength
          },
          apiKey
        );

        let postToUpdate = updatedPostsMap.get(targetPost.id) || { ...targetPost };
        const newCommentObj = {
          id: `comment-${now}-${Math.random()}`,
          postId: targetPost.id,
          userId: actor.id,
          username: actor.username,
          userAvatar: actor.avatar,
          text: commentText,
          createdAt: now
        };

        postToUpdate = {
          ...postToUpdate,
          commentsCount: postToUpdate.commentsCount + 1,
          comments: [newCommentObj, ...postToUpdate.comments]
        };
        updatedPostsMap.set(targetPost.id, postToUpdate);

        // Update relationship
        rel.interactionCount += 2;
        rel.relationshipStrength = Math.min(1.0, rel.relationshipStrength + 0.2);
        relationships.set(relKey, rel);
        updatedRelationships.push(rel);

        events.push({
          id: `evt-comment-${now}-${Math.random()}`,
          type: 'comment',
          actorId: actor.id,
          targetId: targetPost.id,
          timestamp: now,
          description: `@${actor.username} mengomentari postingan @${targetPost.username}: "${commentText}"`
        });

        if (targetPost.userId === userProfile.id) {
          newNotifications.push({
            id: `notif-${now}-${Math.random()}`,
            recipientId: userProfile.id,
            actorId: actor.id,
            actorUsername: actor.username,
            actorAvatar: actor.avatar,
            type: 'comment',
            postId: targetPost.id,
            commentText,
            createdAt: now,
            read: false
          });
        }
      }

      // --- 3. PROFILE VISIT & FOLLOW SIMULATION ---
      const pVisit = actor.engagementTendency.profileVisitProbability * 0.3;
      if (Math.random() < pVisit) {
        events.push({
          id: `evt-visit-${now}-${Math.random()}`,
          type: 'profile_visit',
          actorId: actor.id,
          targetId: targetPost.userId,
          timestamp: now,
          description: `@${actor.username} mengunjungi profil @${targetPost.username}`
        });

        // Follow check after profile visit
        if (!rel.isFollowing) {
          const pFollow = actor.engagementTendency.followProbability * 
            (rel.relationshipStrength > 0.3 ? 1.8 : 0.8) * 
            (Math.random() < 0.2 ? 1.5 : 0.6);

          if (Math.random() < pFollow) {
            rel.isFollowing = true;
            rel.relationshipStrength = Math.min(1.0, rel.relationshipStrength + 0.3);
            relationships.set(relKey, rel);
            updatedRelationships.push(rel);

            events.push({
              id: `evt-follow-${now}-${Math.random()}`,
              type: 'follow',
              actorId: actor.id,
              targetId: targetPost.userId,
              timestamp: now,
              description: `@${actor.username} mulai mengikuti @${targetPost.username}`
            });

            if (targetPost.userId === userProfile.id) {
              newNotifications.push({
                id: `notif-${now}-${Math.random()}`,
                recipientId: userProfile.id,
                actorId: actor.id,
                actorUsername: actor.username,
                actorAvatar: actor.avatar,
                type: 'follow',
                createdAt: now,
                read: false
              });

              const currentStats = userStatUpdates.get(userProfile.id) || {};
              userStatUpdates.set(userProfile.id, {
                ...currentStats,
                followersCount: (currentStats.followersCount || userProfile.id ? 1 : 0) + 1
              });
            }
          }
        }
      }
    }
  }

  return {
    events,
    newPosts,
    updatedPosts: Array.from(updatedPostsMap.values()),
    newNotifications,
    updatedUsers: Array.from(userStatUpdates.entries()).map(([userId, stats]) => ({
      userId,
      ...stats
    })),
    updatedRelationships
  };
}
