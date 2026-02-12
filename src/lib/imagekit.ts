export const IMAGEKIT_BASE_URL = 'https://ik.imagekit.io/uxpkojtoy';
export const IMAGEKIT_ID = 'uxpkojtoy';

export function buildImageKitPrompt(imagePrompt: string, altImageName = 'image.jpg') {
  return `${IMAGEKIT_BASE_URL}/prompt-${encodeURIComponent(imagePrompt)}/${altImageName}`;
}
