export const IMAGEKIT_BASE_URL = 'https://ik.imagekit.io/uxpkojtoy';
export const IMAGEKIT_ID = 'uxpkojtoy';

export function buildImageKitPrompt(imagePrompt: string, altImageName = 'image.jpg') {
  return `${IMAGEKIT_BASE_URL}/prompt-${encodeURIComponent(imagePrompt)}/${altImageName}`;
}
// Example usage:// const imageUrl = buildImageKitPrompt('a beautiful sunset over the mountains', 'sunset.jpg'); // console.log(imageUrl); // https://ik.imagekit.io/uxpkojtoy/prompt-a%20beautiful%20sunset%20over%20the%20mountains/sunset.jpg