/** Joins truthy class names */
export const cx = (...parts: Array<string | false | null | undefined | 0>): string =>
  parts.filter(Boolean).join(' ');
