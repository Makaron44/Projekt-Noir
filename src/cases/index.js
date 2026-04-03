import { case1 } from './case1_blackwood.js';
import { case2 } from './case2_diamond.js';
import { case3 } from './case3_opera.js';
import { case4 } from './case4_omega.js';

export const allCases = [case1, case2, case3, case4];

export function getCaseById(id) {
  return allCases.find(c => c.id === id) || null;
}

export function getCompletedCases() {
  try {
    return JSON.parse(localStorage.getItem('noir_completed') || '[]');
  } catch { return []; }
}

export function markCaseCompleted(id) {
  const completed = getCompletedCases();
  if (!completed.includes(id)) {
    completed.push(id);
    localStorage.setItem('noir_completed', JSON.stringify(completed));
  }
}
