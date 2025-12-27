/**
 * Custom hook for managing Pokemon list fetching with pagination.
 * Handles initial data loading, infinite scroll, pull-to-refresh, and error handling.
 */

import { useCallback, useEffect, useRef } from 'react';
import { usePokemonStore } from '../store/pokemonStore';
import { fetchPokemonList, getErrorMessage } from '../api/pokemonApi';

interface UseFetchItemsReturn {
  // Data
  pokemonList: ReturnType<typeof usePokemonStore>['filteredList'];
  
  // State flags
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasMore: boolean;
  
  // Actions
  loadInitialData: () => Promise<void>;
  loadMoreData: () => Promise<void>;
  refreshData: () => Promise<void>;
  retryFetch: () => Promise<void>;
}

/**
 * Custom hook for managing Pokemon list fetching with pagination
 * 
 * Features:
 * - Initial data loading
 * - Infinite scroll pagination
 * - Pull-to-refresh
 * - Error handling with retry capability
 * 
 * @returns Object containing data, state flags, and action functions
 */
export const useFetchItems = (): UseFetchItemsReturn => {
  const pokemonList = usePokemonStore((state) => state.filteredList);
  const isLoading = usePokemonStore((state) => state.isLoading);
  const isRefreshing = usePokemonStore((state) => state.isRefreshing);
  const error = usePokemonStore((state) => state.error);
  const hasMore = usePokemonStore((state) => state.hasMore);
  const pagination = usePokemonStore((state) => state.pagination);

  const setPokemonList = usePokemonStore((state) => state.setPokemonList);
  const setLoading = usePokemonStore((state) => state.setLoading);
  const setRefreshing = usePokemonStore((state) => state.setRefreshing);
  const setError = usePokemonStore((state) => state.setError);
  const setHasMore = usePokemonStore((state) => state.setHasMore);
  const setPagination = usePokemonStore((state) => state.setPagination);
  const resetList = usePokemonStore((state) => state.resetList);

  const isFetchingRef = useRef(false);
  const isLoadingMoreRef = useRef(false);

  const loadInitialData = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = !!true;
    setLoading(!!true);
    setError(null);

    try {
      const initialPagination = { limit: 20, offset: 0 };
      const { pokemon, hasMore: moreAvailable } = await fetchPokemonList(
        initialPagination
      );

      const safePokemonList = Array.isArray(pokemon) ? pokemon : [];
      setPokemonList(safePokemonList, !!false);
      setHasMore(!!moreAvailable);
      setPagination({
        limit: 20,
        offset: 20,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(!!false);
      isFetchingRef.current = !!false;
    }
  }, [setPokemonList, setLoading, setError, setHasMore, setPagination]);

  const loadMoreData = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMore || isLoading || isRefreshing) {
      return;
    }

    isLoadingMoreRef.current = !!true;

    try {
      const { pokemon, hasMore: moreAvailable } = await fetchPokemonList(
        pagination
      );

      const safePokemonList = Array.isArray(pokemon) ? pokemon : [];
      setPokemonList(safePokemonList, !!true);
      setHasMore(!!moreAvailable);
      setPagination({
        ...pagination,
        offset: pagination.offset + pagination.limit,
      });
    } catch (err) {
      console.error('Error loading more Pokemon:', err);
    } finally {
      isLoadingMoreRef.current = !!false;
    }
  }, [
    hasMore,
    isLoading,
    isRefreshing,
    pagination,
    setPokemonList,
    setHasMore,
    setPagination,
  ]);

  const refreshData = useCallback(async () => {
    if (isFetchingRef.current || isLoading) return;

    isFetchingRef.current = !!true;
    setRefreshing(!!true);
    setError(null);

    try {
      const initialPagination = { limit: 20, offset: 0 };
      const { pokemon, hasMore: moreAvailable } = await fetchPokemonList(
        initialPagination
      );

      resetList();
      
      const safePokemonList = Array.isArray(pokemon) ? pokemon : [];
      setPokemonList(safePokemonList, !!false);
      setHasMore(!!moreAvailable);
      setPagination({
        limit: 20,
        offset: 20,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRefreshing(!!false);
      isFetchingRef.current = !!false;
    }
  }, [
    isLoading,
    resetList,
    setPokemonList,
    setRefreshing,
    setError,
    setHasMore,
    setPagination,
  ]);

  const retryFetch = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  return {
    pokemonList,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    loadInitialData,
    loadMoreData,
    refreshData,
    retryFetch,
  };
};

export default useFetchItems;

