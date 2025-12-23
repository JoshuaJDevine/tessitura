import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const isHidden = false;
      const result = cn('base', isHidden && 'hidden', 'visible');
      expect(result).toBe('base visible');
    });

    it('should merge tailwind classes correctly', () => {
      const result = cn('p-4', 'p-6');
      // tailwind-merge should keep only p-6
      expect(result).toBe('p-6');
    });
  });
});
