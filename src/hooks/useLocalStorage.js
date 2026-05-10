/**
 * Mental Calculations — useLocalStorage Hook
 * Persiste estado no LocalStorage automaticamente
 */
import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
