'use client';

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return typeof initialValue === 'function'
          ? (initialValue as () => T)()
          : initialValue;
      }
      return JSON.parse(item) as T;
    } catch {
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(next));
          } catch {
            console.warn(`localStorage.setItem failed for key "${key}"`);
          }
        }
        return next;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    setStoredValue(
      typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
    );
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
