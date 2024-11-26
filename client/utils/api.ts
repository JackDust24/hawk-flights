export const getApiUrl = () => {
  // When running in Docker, use the service name
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Fallback for local development
  return process.env.API_URL || 'http://localhost:4000';
};
