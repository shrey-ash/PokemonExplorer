/**
 * Centralized color palette and Pokemon type colors.
 */

export const Colors = {
  primary: '#E63946',
  secondary: '#1D3557',
  accent: '#F4A261',
  
  background: '#0D1B2A',
  surface: '#1B263B',
  surfaceLight: '#243B53',
  
  textPrimary: '#F1FAEE',
  textSecondary: '#A8DADC',
  textMuted: '#6B7F8E',
  
  success: '#2EC4B6',
  warning: '#F4A261',
  error: '#E63946',
  
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  border: '#2D3E50',
  borderLight: '#3D5A73',
};

export const TypeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export const getTypeColor = (type: string): string => {
  return TypeColors[type.toLowerCase()] || TypeColors.normal;
};

export default Colors;

