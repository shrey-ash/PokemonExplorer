/**
 * ============================================================================
 * COMPONENTS INDEX
 * ============================================================================
 * 
 * Architecture Decision:
 * - Barrel exports provide a clean import interface
 * - Components can be imported from a single location
 */

export { default as StateHandler } from './StateHandler';
export { default as PokemonCard } from './PokemonCard';
export { default as SearchBar } from './SearchBar';
export { default as LoadingFooter } from './LoadingFooter';
export { default as StatBar } from './StatBar';
export { default as TypeBadge } from './TypeBadge';

