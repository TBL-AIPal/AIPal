/* eslint-disable no-console */
import toast from 'react-hot-toast';

/**
 * Displays a success toast notification and logs the message if logging is enabled.
 * @param {string} text - The notification message to display and log.
 */
export function createInfoToast(text: string): void {
  if (typeof window === 'undefined') return;

  // Display the toast notification
  toast.success(text);
}

/**
 * Displays a error toast notification and logs the message if logging is enabled.
 * @param {string} text - The notification message to display and log.
 */
export function createErrorToast(text: string): void {
    if (typeof window === 'undefined') return;
  
    // Display the toast notification
    toast.error(text);
  }
