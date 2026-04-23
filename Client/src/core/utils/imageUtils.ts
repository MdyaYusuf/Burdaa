const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';

export const getProfileImageUri = (path: string | undefined | null): string | null => {

  if (!path) {
    return null;
  }

  if (path.startsWith('file://') || path.startsWith('http')) {
    return path;
  }

  return `${IMAGE_BASE_URL}${path}`;
};