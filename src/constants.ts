import { CategoryItem, User } from './types';

<<<<<<< HEAD
export const USERS: User[] = ['shek', 'yoyo'];
=======
export const USERS: User[] = ['User A', 'User B'];
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Groceries', color: '#34d399' },
  { id: '2', name: 'Rent/Bills', color: '#f87171' },
  { id: '3', name: 'Dining', color: '#fbbf24' },
  { id: '4', name: 'Transport', color: '#60a5fa' },
  { id: '5', name: 'Entertainment', color: '#a78bfa' },
  { id: '6', name: 'Other', color: '#94a3b8' },
];

export const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'
];

export const STORAGE_KEY = 'fairshare_expenses_v1';
export const CATEGORIES_STORAGE_KEY = 'fairshare_categories_v1';
export const USER_NAMES_KEY = 'fairshare_usernames_v1';

// BACKEND CONFIGURATION
export const USE_BACKEND = false; 
export const API_URL = 'http://localhost:3001/api';
