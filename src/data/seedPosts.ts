import { Post } from '../types/sosmet';

const NOW = Date.now();

export const INITIAL_SEED_POSTS: Post[] = [
  {
    id: 'post-1',
    userId: 'syn-1',
    username: 'naya_vibe',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    caption: 'Quiet morning before the city wakes up ☕✨',
    createdAt: NOW - 3600000 * 2,
    likesCount: 14,
    commentsCount: 3,
    niche: 'coffee',
    likedBy: ['syn-3', 'syn-4', 'syn-10', 'syn-12'],
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        userId: 'syn-3',
        username: 'fira.coffee',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        text: 'dimana iniii 😭',
        createdAt: NOW - 3600000 * 1.5
      },
      {
        id: 'c-2',
        postId: 'post-1',
        userId: 'syn-10',
        username: 'bimo.coop',
        userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        text: 'vibesnya dapet bgt',
        createdAt: NOW - 3600000 * 1.2
      },
      {
        id: 'c-3',
        postId: 'post-1',
        userId: 'syn-12',
        username: 'tania.daily',
        userAvatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
        text: 'cuaca cerah bgt yaaa',
        createdAt: NOW - 3600000 * 0.8
      }
    ],
    visualMetadata: {
      content_type: 'coffee_shot',
      scene: 'coffee_shop',
      subjects: ['coffee_cup', 'table'],
      mood: 'cozy',
      visual_style: 'warm_tone',
      objects: ['mug', 'wood_table', 'plant'],
      possible_topics: ['coffee', 'morning', 'cafe']
    }
  },
  {
    id: 'post-2',
    userId: 'syn-4',
    username: 'kevin_strt',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    caption: 'oversized knit + vintage dunks. ready for weekend 👟',
    createdAt: NOW - 3600000 * 5,
    likesCount: 28,
    commentsCount: 2,
    niche: 'streetwear',
    likedBy: ['syn-1', 'syn-2', 'syn-8', 'syn-12'],
    comments: [
      {
        id: 'c-4',
        postId: 'post-2',
        userId: 'syn-12',
        username: 'tania.daily',
        userAvatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
        text: 'fitnya cakep vin 🔥',
        createdAt: NOW - 3600000 * 4
      },
      {
        id: 'c-5',
        postId: 'post-2',
        userId: 'syn-8',
        username: 'adit.tech',
        userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        text: 'sepatunya dapet dimana nih',
        createdAt: NOW - 3600000 * 3.5
      }
    ],
    visualMetadata: {
      content_type: 'outfit_post',
      scene: 'urban_street',
      subjects: ['person', 'sneakers'],
      mood: 'stylish',
      visual_style: 'street_photography',
      objects: ['sneakers', 'hoodie', 'denim'],
      outfit: ['vintage sweater', 'dunks'],
      possible_topics: ['streetwear', 'outfit', 'sneakers']
    }
  },
  {
    id: 'post-3',
    userId: 'syn-2',
    username: 'dhaniel.arch',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    caption: 'Geometrics in natural daylight. Minimalist exterior concept.',
    createdAt: NOW - 3600000 * 9,
    likesCount: 6,
    commentsCount: 0,
    niche: 'architecture',
    likedBy: ['syn-5', 'syn-7'],
    comments: [],
    visualMetadata: {
      content_type: 'architectural_shot',
      scene: 'building_exterior',
      subjects: ['concrete_wall', 'window'],
      mood: 'minimalist',
      visual_style: 'clean_lines',
      objects: ['concrete', 'glass'],
      possible_topics: ['architecture', 'design', 'structure']
    }
  },
  {
    id: 'post-4',
    userId: 'syn-5',
    username: 'rachel.visuals',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
    caption: 'Golden hour captured on Kodak Gold 200 🎞️',
    createdAt: NOW - 3600000 * 14,
    likesCount: 42,
    commentsCount: 4,
    niche: 'photography',
    likedBy: ['syn-1', 'syn-2', 'syn-4', 'syn-9', 'syn-11'],
    comments: [
      {
        id: 'c-6',
        postId: 'post-4',
        userId: 'syn-11',
        username: 'clara_art',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'tonalnya gila bgt 😍',
        createdAt: NOW - 3600000 * 12
      },
      {
        id: 'c-7',
        postId: 'post-4',
        userId: 'syn-9',
        username: 'mira.wander',
        userAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
        text: 'sublime!',
        createdAt: NOW - 3600000 * 10
      }
    ],
    visualMetadata: {
      content_type: 'landscape',
      scene: 'outdoor_nature',
      subjects: ['sunlight', 'trees'],
      mood: 'nostalgic',
      visual_style: 'analog_film',
      objects: ['sun', 'hills'],
      possible_topics: ['film', 'photography', 'goldenhour']
    }
  },
  {
    id: 'post-5',
    userId: 'syn-7',
    username: 'keiko_minimal',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
    caption: 'Calm corner for reading.',
    createdAt: NOW - 3600000 * 18,
    likesCount: 1,
    commentsCount: 0,
    niche: 'minimalist',
    likedBy: ['syn-2'],
    comments: [],
    visualMetadata: {
      content_type: 'interior',
      scene: 'room',
      subjects: ['chair', 'lamp'],
      mood: 'calm',
      visual_style: 'minimal',
      objects: ['wooden_chair', 'book'],
      possible_topics: ['decor', 'minimalist', 'interior']
    }
  },
  {
    id: 'post-6',
    userId: 'syn-8',
    username: 'adit.tech',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    caption: 'Clean desk setup for late night debugging sessions 💻💡',
    createdAt: NOW - 3600000 * 22,
    likesCount: 19,
    commentsCount: 1,
    niche: 'tech',
    likedBy: ['syn-2', 'syn-4'],
    comments: [
      {
        id: 'c-8',
        postId: 'post-6',
        userId: 'syn-4',
        username: 'kevin_strt',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        text: 'keyb nya type apa bro?',
        createdAt: NOW - 3600000 * 20
      }
    ],
    visualMetadata: {
      content_type: 'tech_setup',
      scene: 'workspace',
      subjects: ['monitor', 'keyboard'],
      mood: 'focused',
      visual_style: 'dark_mode',
      objects: ['keyboard', 'screen', 'lightbar'],
      possible_topics: ['tech', 'setup', 'coding']
    }
  }
];
