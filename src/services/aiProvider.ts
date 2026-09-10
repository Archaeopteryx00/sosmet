import { VisualMetadata, SyntheticUser, Post } from '../types/sosmet';

export interface CommentPromptInput {
  commenter: SyntheticUser;
  post: Post;
  visualMetadata?: VisualMetadata;
  relationshipStrength: number;
}

export interface AIProvider {
  name: string;
  analyzeImage(imageUrlOrBase64: string, caption?: string): Promise<VisualMetadata>;
  generateComment(input: CommentPromptInput): Promise<string>;
}

// 1. Fallback Deterministic Local AI Provider (Works 100% without API Keys)
export class FallbackAIProvider implements AIProvider {
  name = 'fallback';

  async analyzeImage(imageUrlOrBase64: string, caption: string = ''): Promise<VisualMetadata> {
    const textLower = caption.toLowerCase();
    
    let scene = 'indoor';
    let mood = 'casual';
    let content_type = 'photo';
    const subjects = ['subject'];
    const objects = ['photo_element'];
    const possible_topics: string[] = ['daily', 'photo'];

    if (textLower.includes('coffee') || textLower.includes('brew') || textLower.includes('latte')) {
      scene = 'cafe';
      mood = 'cozy';
      content_type = 'beverage';
      possible_topics.push('coffee', 'morning', 'cafe');
      objects.push('coffee_cup');
    } else if (textLower.includes('outfit') || textLower.includes('fit') || textLower.includes('style') || textLower.includes('dunks')) {
      scene = 'urban_street';
      mood = 'stylish';
      content_type = 'fashion';
      possible_topics.push('streetwear', 'fashion', 'outfit');
      objects.push('clothing', 'sneakers');
    } else if (textLower.includes('sunset') || textLower.includes('view') || textLower.includes('trip') || textLower.includes('nature')) {
      scene = 'outdoor_nature';
      mood = 'peaceful';
      content_type = 'landscape';
      possible_topics.push('nature', 'travel', 'view');
      objects.push('landscape', 'sky');
    } else if (textLower.includes('desk') || textLower.includes('code') || textLower.includes('setup')) {
      scene = 'workspace';
      mood = 'focused';
      content_type = 'tech';
      possible_topics.push('tech', 'setup', 'coding');
      objects.push('monitor', 'keyboard');
    }

    return {
      content_type,
      scene,
      subjects,
      mood,
      visual_style: 'natural_light',
      objects,
      possible_topics
    };
  }

  async generateComment(input: CommentPromptInput): Promise<string> {
    const { commenter, post, visualMetadata } = input;
    const style = commenter.commentStyle;
    const topics = visualMetadata?.possible_topics || [];
    const isCoffee = topics.includes('coffee') || post.niche === 'coffee';
    const isFashion = topics.includes('streetwear') || post.niche === 'streetwear';
    const isTech = topics.includes('tech') || post.niche === 'tech';

    // Personality & style templates for natural Indonesian social media comments
    const shortReactions = ['dimana iniii 😭', 'vibesnya dapet bgt', 'cakep!', 'suka bgt tatanannya', 'spill lokasi bro', 'estetik abis', 'parah sih ini'];
    const emojiReactions = ['🔥✨', '😍💯', '☕🌿', '👏🔥', '😭🤍', '🙌', '✨✨'];
    const casualRemarks = [
      'gokil sih ini fotonya',
      'cuaca cerah bgt ya hari ini',
      'kayak pernah liat tempat ini',
      'slide terakhir fav sih',
      'bagus bgt pencahayaannya',
      'mantap bang!'
    ];
    const questions = ['dimana nih bro?', 'spill outfitnya dong', 'pake kamera apa iniii', 'jam brp ke lokasi?'];
    const fashionComments = ['fitnya dapet bgt!', 'sneakersnya gokil', 'kece bgt kombinasi warnanya 🔥', 'brand mana tuh sweaternya?'];
    const coffeeComments = ['enak bgt kliatan beansnya', 'buka ampe jam brp disitu?', 'manual brew favorit nih', 'kopi sore dapet vibesnya'];
    const techComments = ['clean bgt desk setupnya', 'spill keyboard spec bro', 'lampunya pake merk apa?'];

    let pool = casualRemarks;

    if (style === 'emoji') pool = emojiReactions;
    else if (style === 'short') pool = shortReactions;
    else if (style === 'questioning') pool = questions;
    else if (isFashion) pool = fashionComments;
    else if (isCoffee) pool = coffeeComments;
    else if (isTech) pool = techComments;

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }
}

// 2. Google Gemini Multimodal AI Provider (Active if API key exists)
export class GeminiAIProvider implements AIProvider {
  name = 'gemini';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeImage(imageUrlOrBase64: string, caption: string = ''): Promise<VisualMetadata> {
    try {
      // Use fallback if call fails or API key is mock
      if (!this.apiKey || this.apiKey === 'mock') {
        return new FallbackAIProvider().analyzeImage(imageUrlOrBase64, caption);
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this image caption "${caption}" and image URL. Return valid JSON only with keys: content_type, scene, subjects (array), mood, visual_style, objects (array), possible_topics (array).`
                  }
                ]
              }
            ],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Gemini API call failed');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return JSON.parse(text) as VisualMetadata;
      }
    } catch (e) {
      console.warn('Gemini vision analysis failed, falling back to local provider:', e);
    }
    return new FallbackAIProvider().analyzeImage(imageUrlOrBase64, caption);
  }

  async generateComment(input: CommentPromptInput): Promise<string> {
    try {
      if (!this.apiKey || this.apiKey === 'mock') {
        return new FallbackAIProvider().generateComment(input);
      }

      const prompt = `You are @${input.commenter.username} on Sosmet (a casual Indonesian photo social app).
Bio: ${input.commenter.bio}
Personality: ${input.commenter.archetype}
Comment style: ${input.commenter.commentStyle}

Write ONE short, casual social media comment in Indonesian/Jaksel slang for this post:
Caption: "${input.post.caption}"
Topics: ${input.visualMetadata?.possible_topics?.join(', ') || 'photo'}

Rules:
- Keep it under 10 words.
- Natural, imperfect, social media tone.
- Do NOT output quotes, JSON, or explanations.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const comment = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (comment) return comment.replace(/^["']|["']$/g, '');
      }
    } catch (e) {
      console.warn('Gemini comment generation failed, falling back:', e);
    }
    return new FallbackAIProvider().generateComment(input);
  }
}

// AI Provider Factory
export function getAIProvider(apiKey?: string, providerName: string = 'fallback'): AIProvider {
  if (apiKey && (providerName === 'gemini' || apiKey.length > 10)) {
    return new GeminiAIProvider(apiKey);
  }
  return new FallbackAIProvider();
}
