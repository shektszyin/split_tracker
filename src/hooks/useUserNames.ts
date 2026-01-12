import { useState, useEffect } from 'react';
import { USER_NAMES_KEY, USERS as DEFAULT_USERS } from '../constants';

export const useUserNames = () => {
  const [userNames, setUserNames] = useState<string[]>(DEFAULT_USERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(USER_NAMES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 2) {
            setUserNames(parsed);
        }
      } catch (e) {
        // Fallback to default
      }
    }
    setIsLoaded(true);
  }, []);

  const updateUserName = (index: number, newName: string) => {
    if (!newName.trim()) return;
    const newNames = [...userNames];
    newNames[index] = newName.trim();
    setUserNames(newNames);
    localStorage.setItem(USER_NAMES_KEY, JSON.stringify(newNames));
  };

  return { userNames, updateUserName, isLoaded };
};