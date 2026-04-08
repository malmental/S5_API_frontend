/**
 * ============================================================
 * CONSTANTS: Application constants
 * ============================================================
 * Centralized constants to avoid magic strings throughout
 * the application.
 */

export const PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
};

export const API_ROUTES = {
  INCIDENCES: '/incidences',
  MY_INCIDENCES: '/my-incidences',
  METRICS: '/metrics',
  ME: '/me',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  USERS: '/users',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
};
