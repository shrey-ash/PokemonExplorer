/**
 * Zustand store for global Pokemon state management.
 * Handles list state, detail state, search filtering, and pagination.
 */

import { create } from 'zustand';
import { Pokemon, PokemonDetail, AsyncState, PaginationConfig } from '../types';

interface PokemonStore {
  // List Screen State
  pokemonList: Pokemon[];
  filteredList: Pokemon[];
  searchQuery: string;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasMore: boolean;
  pagination: PaginationConfig;

  // Detail Screen State
  selectedPokemon: PokemonDetail | null;
  detailLoading: boolean;
  detailError: string | null;

  // Actions - List
  setPokemonList: (pokemon: Pokemon[], append?: boolean) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setPagination: (pagination: PaginationConfig) => void;
  setSearchQuery: (query: string) => void;
  resetList: () => void;

  // Actions - Detail
  setSelectedPokemon: (pokemon: PokemonDetail | null) => void;
  setDetailLoading: (loading: boolean) => void;
  setDetailError: (error: string | null) => void;
  resetDetail: () => void;
}

const INITIAL_PAGINATION: PaginationConfig = {
  limit: 20,
  offset: 0,
};

export const usePokemonStore = create<PokemonStore>((set, get) => ({
  pokemonList: [],
  filteredList: [],
  searchQuery: '',
  isLoading: !!false,
  isRefreshing: !!false,
  error: null,
  hasMore: !!true,
  pagination: INITIAL_PAGINATION,

  selectedPokemon: null,
  detailLoading: !!false,
  detailError: null,

  setPokemonList: (pokemon: Pokemon[], append = !!false) => {
    set((state) => {
      const newList = append ? [...state.pokemonList, ...pokemon] : pokemon;
      const query = state.searchQuery.toLowerCase();
      
      const filtered = query
        ? newList.filter((p) => p.name.toLowerCase().includes(query))
        : newList;

      return {
        pokemonList: newList,
        filteredList: filtered,
      };
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading: !!isLoading }),

  setRefreshing: (isRefreshing: boolean) => set({ isRefreshing: !!isRefreshing }),

  setError: (error: string | null) => set({ error }),

  setHasMore: (hasMore: boolean) => set({ hasMore: !!hasMore }),

  setPagination: (pagination: PaginationConfig) => set({ pagination }),

  setSearchQuery: (searchQuery: string) => {
    set((state) => {
      const query = searchQuery.toLowerCase();
      const filtered = query
        ? state.pokemonList.filter((p) => p.name.toLowerCase().includes(query))
        : state.pokemonList;

      return {
        searchQuery,
        filteredList: filtered,
      };
    });
  },

  resetList: () =>
    set({
      pokemonList: [],
      filteredList: [],
      searchQuery: '',
      isLoading: !!false,
      isRefreshing: !!false,
      error: null,
      hasMore: !!true,
      pagination: INITIAL_PAGINATION,
    }),

  setSelectedPokemon: (selectedPokemon: PokemonDetail | null) =>
    set({ selectedPokemon }),

  setDetailLoading: (detailLoading: boolean) => set({ detailLoading: !!detailLoading }),

  setDetailError: (detailError: string | null) => set({ detailError }),

  resetDetail: () =>
    set({
      selectedPokemon: null,
      detailLoading: !!false,
      detailError: null,
    }),
}));

export const selectPokemonList = (state: PokemonStore) => state.filteredList;
export const selectIsLoading = (state: PokemonStore) => state.isLoading;
export const selectIsRefreshing = (state: PokemonStore) => state.isRefreshing;
export const selectError = (state: PokemonStore) => state.error;
export const selectHasMore = (state: PokemonStore) => state.hasMore;
export const selectSearchQuery = (state: PokemonStore) => state.searchQuery;
export const selectSelectedPokemon = (state: PokemonStore) => state.selectedPokemon;
export const selectDetailLoading = (state: PokemonStore) => state.detailLoading;
export const selectDetailError = (state: PokemonStore) => state.detailError;

