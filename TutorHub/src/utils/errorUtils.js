/**
 * Extract an error message from an API response or generic Error object.
 * Useful for displaying to users in toasts/alerts.
 */
export const getErrorMessage = (
  error,
  defaultFallback = 'An unexpected error occurred. Please try again.'
) => {
  if (!error) return defaultFallback;

  if (error.response) {
    const data = error.response.data;
    if (data) {
      if (typeof data === 'string') return data;
      if (data.message) return data.message;
      if (data.error) return data.error;
    }
  } else if (error.request) {
    return 'No response received from server. Please check your internet connection.';
  }

  return error.message || defaultFallback;
};
