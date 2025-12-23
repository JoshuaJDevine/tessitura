import { describe, it, expect } from 'vitest';
import { getRarityTier, type RarityTier } from './rarity';

describe('getRarityTier', () => {
  describe('common tier (0-4 uses)', () => {
    it('should return "common" for 0 uses', () => {
      expect(getRarityTier(0)).toBe('common');
    });

    it('should return "common" for 1 use', () => {
      expect(getRarityTier(1)).toBe('common');
    });

    it('should return "common" for 4 uses', () => {
      expect(getRarityTier(4)).toBe('common');
    });
  });

  describe('rare tier (5-19 uses)', () => {
    it('should return "rare" for 5 uses (boundary)', () => {
      expect(getRarityTier(5)).toBe('rare');
    });

    it('should return "rare" for 10 uses', () => {
      expect(getRarityTier(10)).toBe('rare');
    });

    it('should return "rare" for 19 uses (boundary)', () => {
      expect(getRarityTier(19)).toBe('rare');
    });
  });

  describe('epic tier (20-49 uses)', () => {
    it('should return "epic" for 20 uses (boundary)', () => {
      expect(getRarityTier(20)).toBe('epic');
    });

    it('should return "epic" for 35 uses', () => {
      expect(getRarityTier(35)).toBe('epic');
    });

    it('should return "epic" for 49 uses (boundary)', () => {
      expect(getRarityTier(49)).toBe('epic');
    });
  });

  describe('legendary tier (50+ uses)', () => {
    it('should return "legendary" for 50 uses (boundary)', () => {
      expect(getRarityTier(50)).toBe('legendary');
    });

    it('should return "legendary" for 100 uses', () => {
      expect(getRarityTier(100)).toBe('legendary');
    });

    it('should return "legendary" for 1000 uses', () => {
      expect(getRarityTier(1000)).toBe('legendary');
    });
  });

  describe('edge cases', () => {
    it('should return "common" for negative numbers', () => {
      expect(getRarityTier(-1)).toBe('common');
      expect(getRarityTier(-100)).toBe('common');
    });

    it('should return "legendary" for very large numbers', () => {
      expect(getRarityTier(Number.MAX_SAFE_INTEGER)).toBe('legendary');
    });

    it('should handle floating point numbers correctly', () => {
      // Should treat as common since 4.9 < 5
      expect(getRarityTier(4.9)).toBe('common');
      // Should treat as rare since 5.1 >= 5
      expect(getRarityTier(5.1)).toBe('rare');
    });
  });

  describe('boundary values', () => {
    it('should correctly handle all tier boundaries', () => {
      const boundaries: Array<{ count: number; expected: RarityTier }> = [
        { count: 0, expected: 'common' },
        { count: 4, expected: 'common' },
        { count: 5, expected: 'rare' },
        { count: 19, expected: 'rare' },
        { count: 20, expected: 'epic' },
        { count: 49, expected: 'epic' },
        { count: 50, expected: 'legendary' },
        { count: 100, expected: 'legendary' },
      ];

      boundaries.forEach(({ count, expected }) => {
        expect(getRarityTier(count)).toBe(expected);
      });
    });
  });
});
