import { VisualMetadata } from '../types/sosmet';
import { getAIProvider } from './aiProvider';

export async function analyzeUserUploadedImage(
  imageUrlOrBase64: string,
  caption: string = '',
  apiKey?: string
): Promise<VisualMetadata> {
  const provider = getAIProvider(apiKey);
  return await provider.analyzeImage(imageUrlOrBase64, caption);
}
