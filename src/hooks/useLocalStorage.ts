import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try { 
      return window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)!) : initialValue; 
    } 
    catch { 
      return initialValue; 
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } 
    catch (error) { 
      console.error(error); 
    }
  };
  
  return [storedValue, setValue] as const;
}