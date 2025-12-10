import { useEffect, useState } from "react";

/**
 * useDebounce Hook
 *
 * Delays updating a value until user stops typing.
 *
 * Why use debouncing?
 * - Reduces API calls during typing
 * - Improves performance
 * - Better user experience (waits for complete input)
 * - Saves server resources
 *
 * Example:
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * // API call only happens 500ms after user stops typing
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 */

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout to update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
