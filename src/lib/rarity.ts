/**
 * Rarity calculation utility for instrument cards.
 *
 * Determines visual rarity tier based on usage count to provide
 * visual feedback about instrument usage patterns.
 */

export type RarityTier = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Calculates the rarity tier for an instrument based on its usage count.
 *
 * @param usageCount - The number of times the instrument has been marked as used
 * @returns The rarity tier string
 *
 * @example
 * ```ts
 * getRarityTier(0)   // 'common'
 * getRarityTier(5)   // 'rare'
 * getRarityTier(20)  // 'epic'
 * getRarityTier(50)  // 'legendary'
 * ```
 */
export function getRarityTier(usageCount: number): RarityTier {
  if (usageCount >= 50) return 'legendary';
  if (usageCount >= 20) return 'epic';
  if (usageCount >= 5) return 'rare';
  return 'common';
}
