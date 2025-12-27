/**
 * Architecture Decision:
 * Separating API response types from UI types allows for data transformation
 */

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

/**
 * Detailed Pokemon data from PokeAPI
 */
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string | null;
    back_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
}

/**
 * Transformed Pokemon item for UI consumption
 */
export interface Pokemon {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  types: string[];
}

/**
 * Navigation parameter types for type-safe navigation
 */
export type RootStackParamList = {
  PokemonList: undefined;
  PokemonDetail: {
    pokemonId: number;
    pokemonName: string;
  };
};

/**
 * Generic async state for managing loading, error, and data states
 * Architecture Decision: Reusable pattern for any async operation
 */
export interface AsyncState<T> {
  data: T;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasMore: boolean;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  limit: number;
  offset: number;
}

