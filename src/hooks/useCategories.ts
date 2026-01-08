import { useState, useEffect, useCallback } from 'react';
import { CategoryItem } from '../types';
import { DEFAULT_CATEGORIES, CATEGORIES_STORAGE_KEY } from '../constants';

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      try {
        setCategories(JSON.parse(stored));
      } catch (e) {
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const addCategory = (name: string, color: string) => {
    const newCat: CategoryItem = { id: crypto.randomUUID(), name, color };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, name: string, color: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name, color } : c));
  };

  const deleteCategory = (id: string) => {
     if (categories.length <= 1) {
         alert("You must keep at least one category.");
         return;
     }
    setCategories(prev => prev.filter(c => c.id !== id));
  };
  
  const getCategoryColor = useCallback((catName: string) => {
      const cat = categories.find(c => c.name === catName);
      return cat ? cat.color : '#94a3b8';
  }, [categories]);

  return { categories, addCategory, updateCategory, deleteCategory, getCategoryColor, isLoaded };
};
