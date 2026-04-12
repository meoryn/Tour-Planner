import type { BaseIssue } from 'valibot';

export function getValidationErrors(issues: BaseIssue<unknown>[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path?.[0]?.key;
    if (typeof key === 'string' && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
