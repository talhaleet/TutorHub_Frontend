/**
 * Format raw numbers into standard PKR currency strings.
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'PKR 0';
  return `PKR ${amount.toLocaleString()}`;
};

/**
 * Format date string into readable Pakistani standard date.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format duration into user-friendly hours.
 */
export const formatDuration = (hours) => {
  if (!hours) return '0 hrs';
  return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
};

/**
 * Get uppercase initials from a full name (up to 2 chars).
 */
export const getInitials = (fullName) => {
  if (!fullName) return '';
  return fullName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};
