/**
 * Custom hook for fetching and managing Pokemon detail state.
 */

import { useCallback, useEffect } from 'react';
import { usePokemonStore } from '../store/pokemonStore';
import { fetchPokemonDetail, getErrorMessage } from '../api/pokemonApi';
import { PokemonDetail } from '../types';

interface UsePokemonDetailReturn {
  pokemon: PokemonDetail | null;
  isLoading: boolean;
  error: string | null;
  fetchDetail: (idOrName: number | string) => Promise<void>;
  retry: () => Promise<void>;
  cleanup: () => void;
}

/**
 * Custom hook for fetching and managing Pokemon detail state
 * 
 * @param pokemonId - The ID of the Pokemon to fetch
 * @returns Object containing Pokemon data, state flags, and action functions
 */
export const usePokemonDetail = (
  pokemonId: number | string
): UsePokemonDetailReturn => {
  const pokemon = usePokemonStore((state) => state.selectedPokemon);
  const isLoading = usePokemonStore((state) => state.detailLoading);
  const error = usePokemonStore((state) => state.detailError);

  const setSelectedPokemon = usePokemonStore((state) => state.setSelectedPokemon);
  const setDetailLoading = usePokemonStore((state) => state.setDetailLoading);
  const setDetailError = usePokemonStore((state) => state.setDetailError);
  const resetDetail = usePokemonStore((state) => state.resetDetail);

  const fetchDetail = useCallback(
    async (idOrName: number | string) => {
      setDetailLoading(!!true);
      setDetailError(null);

      try {
        const pokemonData = await fetchPokemonDetail(idOrName);
        setSelectedPokemon(pokemonData);
      } catch (err) {
        setDetailError(getErrorMessage(err));
      } finally {
        setDetailLoading(!!false);
      }
    },
    [setSelectedPokemon, setDetailLoading, setDetailError]
  );

  const retry = useCallback(async () => {
    await fetchDetail(pokemonId);
  }, [fetchDetail, pokemonId]);

  const cleanup = useCallback(() => {
    resetDetail();
  }, [resetDetail]);

  useEffect(() => {
    if (pokemonId) {
      fetchDetail(pokemonId);
    }

    return () => {
      resetDetail();
    };
  }, [pokemonId, fetchDetail, resetDetail]);

  return {
    pokemon,
    isLoading,
    error,
    fetchDetail,
    retry,
    cleanup,
  };
};

export default usePokemonDetail;

