import { CommentPromptInput, getAIProvider } from './aiProvider';

export async function generateSyntheticComment(
  input: CommentPromptInput,
  apiKey?: string
): Promise<string> {
  const provider = getAIProvider(apiKey);
  return await provider.generateComment(input);
}
