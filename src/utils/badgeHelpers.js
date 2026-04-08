import { PRIORITIES, STATUSES } from './constants';

/**
 * ============================================================
 * HELPERS: Badge CSS classes for priority and status
 * ============================================================
 * Returns appropriate CSS class strings for badges.
 * Extracted to avoid duplication in IncidentsTable and IncidenceDetail.
 */

export const getPriorityClass = (priority) => {
  if (priority === PRIORITIES.HIGH || priority === 'ALTA' || priority === 'alta') {
    return 'px-2 py-1 text-xs uppercase bg-primary text-white';
  }
  if (priority === PRIORITIES.MEDIUM || priority === 'MEDIA' || priority === 'media') {
    return 'border-2 border-gray-400 px-2 py-1 text-xs uppercase bg-white';
  }
  return 'border-2 border-gray-300 px-2 py-1 text-xs uppercase bg-white';
};

export const getStatusClass = (status) => {
  if (status === STATUSES.OPEN || status === 'ABIERTA') {
    return 'border-2 border-black px-2 py-1 text-xs uppercase bg-white';
  }
  if (status === STATUSES.IN_PROGRESS || status === 'EN_PROCESO') {
    return 'border-2 border-black px-2 py-1 text-xs uppercase bg-white';
  }
  return 'border-2 border-gray-300 px-2 py-1 text-xs uppercase bg-white';
};
