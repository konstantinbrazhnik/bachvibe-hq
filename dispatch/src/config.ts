/**
 * The vocabulary shared by the handbook (10-task-bus.md), the bootstrap
 * script, and this Worker. Change it here and in the handbook together.
 */
export const DEPARTMENTS = [
  'manager',
  'product',
  'engineering',
  'qa',
  'support',
  'marketing',
  'bookkeeping',
] as const;
export type Department = (typeof DEPARTMENTS)[number];

/** Project single-select "Department" option names, by department. */
export const DEPARTMENT_OPTION: Record<Department, string> = {
  manager: 'Management',
  product: 'Product',
  engineering: 'Engineering',
  qa: 'QA',
  support: 'Support',
  marketing: 'Marketing',
  bookkeeping: 'Bookkeeping',
};

export const STATUSES = [
  'Inbox',
  'Triage',
  'Ready',
  'In Progress',
  'In Review',
  'Testing',
  'Done',
  'Blocked',
] as const;
export type Status = (typeof STATUSES)[number];

/** Labels that wake a department other than the card's owner. */
export const NEEDS_LABEL_TO_DEPT: Record<string, Department> = {
  'needs:qa': 'qa',
  'needs:product': 'product',
  'needs:support': 'support',
  'needs:engineering': 'engineering',
  'needs:marketing': 'marketing',
  'needs:bookkeeping': 'bookkeeping',
};

export function deptFromLabel(name: string): Department | null {
  if (name.startsWith('dept:')) {
    const d = name.slice('dept:'.length);
    return (DEPARTMENTS as readonly string[]).includes(d) ? (d as Department) : null;
  }
  return NEEDS_LABEL_TO_DEPT[name] ?? null;
}

export function isDepartment(value: string): value is Department {
  return (DEPARTMENTS as readonly string[]).includes(value);
}
