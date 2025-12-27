/**
 * API layer for fetching Pokémon data from the public Pokémon API.
 * Handles list and detail endpoints and normalizes responses.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  PokemonListResponse,
  PokemonDetail,
  Pokemon,
  PaginationConfig,
} from '../types';


const API_BASE_URL = 'https://pokeapi.co/api/v2';
const REQUEST_TIMEOUT = 10000;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

/**
 * Extracts Pokemon ID from its URL
 * Example: "https://pokeapi.co/api/v2/pokemon/25/" -> 25
 */
const extractPokemonId = (url: string): number => {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
};

/**
 * Generates the official artwork URL for a Pokemon
 */
const getPokemonImageUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

/**
 * Transforms API response to UI-friendly format
 */
const transformPokemonListItem = (
  item: { name: string; url: string }
): Pokemon => {
  const id = extractPokemonId(item.url);
  return {
    id,
    name: item.name,
    url: item.url,
    imageUrl: getPokemonImageUrl(id),
    types: [], // Types are fetched separately on detail screen
  };
};

/**
 * Fetches paginated list of Pokemon
 * 
 * @param pagination - Configuration object with limit and offset
 * @returns Object containing transformed Pokemon list and hasMore flag
 */
export const fetchPokemonList = async (
  pagination: PaginationConfig
): Promise<{ pokemon: Pokemon[]; hasMore: boolean }> => {
  const { limit, offset } = pagination;

  const response = await apiClient.get<PokemonListResponse>('/pokemon', {
    params: { limit, offset },
  });

  const data = response?.data;
  if (!data || !Array.isArray(data.results)) {
    return {
      pokemon: [],
      hasMore: !!false,
    };
  }

  const { results, next } = data;
  const pokemon = results.map(transformPokemonListItem);

  return {
    pokemon,
    hasMore: next !== null,
  };
};

/**
 * Fetches detailed information for a specific Pokemon
 * 
 * @param idOrName - Pokemon ID or name
 * @returns Detailed Pokemon data
 */
export const fetchPokemonDetail = async (
  idOrName: number | string
): Promise<PokemonDetail> => {
  const response = await apiClient.get<PokemonDetail>(`/pokemon/${idOrName}`);
  
  if (!response?.data) {
    throw new Error('Invalid response from Pokemon API');
  }
  
  return response.data;
};

/**
 * Searches Pokemon by name using the API
 * Note: PokeAPI doesn't have a search endpoint, so this fetches by exact name
 * For real search, we'd need a different API or local filtering (which we do in the store)
 * 
 * @param name - Exact Pokemon name
 * @returns Pokemon detail if found
 */
export const searchPokemonByName = async (
  name: string
): Promise<PokemonDetail | null> => {
  try {
    const response = await apiClient.get<PokemonDetail>(
      `/pokemon/${name.toLowerCase()}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Formats error messages for user display
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection and try again.';
    }
    if (!error.response) {
      return 'Network error. Please check your internet connection.';
    }
    switch (error.response.status) {
      case 404:
        return 'Pokemon not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
      case 502:
      case 503:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred. Please try again.';
};

export default apiClient;

