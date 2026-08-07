import { format } from 'date-fns';

/**
 * Safely format a date string or object without throwing RangeError.
 * @param {string|Date|number} dateInput 
 * @param {string} formatStr 
 * @param {string} fallback 
 * @returns {string}
 */
export const formatDate = (dateInput, formatStr = 'MMM d, yyyy', fallback = 'N/A') => {
  if (!dateInput) return fallback;
  try {
    const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(dateObj.getTime())) return fallback;
    return format(dateObj, formatStr);
  } catch {
    return fallback;
  }
};
