/**
 * ============================================================================
 * HOOKS INDEX
 * ============================================================================
 * 
 * Architecture Decision:
 * - Barrel exports provide a clean import interface
 * - Components can import from '@/hooks' instead of individual files
 */

export { useFetchItems } from './useFetchItems';
export { usePokemonDetail } from './usePokemonDetail';

