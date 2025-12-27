/**
 * Pokemon card component for displaying Pokemon items in the list.
 * Uses React.memo for FlatList optimization.
 */

import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Pokemon } from '../types';
import Colors from '../utils/colors';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 48 - CARD_MARGIN) / 2;

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: (pokemon: Pokemon) => void;
}

/**
 * PokemonCard - Renders a single Pokemon item in the list
 * 
 * @param pokemon - Pokemon data to display
 * @param onPress - Callback when card is pressed
 */
const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onPress }) => {
  if (!pokemon) {
    return null;
  }

  const handlePress = useCallback(() => {
    onPress(pokemon);
  }, [pokemon, onPress]);

  const formattedId = `#${String(pokemon?.id ?? 0).padStart(3, '0')}`;
  const formattedName =
    (pokemon?.name ?? 'Unknown').charAt(0).toUpperCase() + (pokemon?.name ?? 'Unknown').slice(1);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.gradientOverlay} />
      
      <View style={styles.idBadge}>
        <Text style={styles.idText}>{formattedId}</Text>
      </View>

      <View style={styles.imageContainer}>
        {pokemon?.imageUrl ? (
          <Image
            source={{ uri: pokemon.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : null}
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {formattedName}
        </Text>
      </View>

      <View style={styles.pokeballDecoration}>
        <View style={styles.pokeballOuter}>
          <View style={styles.pokeballLine} />
          <View style={styles.pokeballCenter} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginBottom: 16,
    marginHorizontal: CARD_MARGIN / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.surfaceLight,
    opacity: 0.3,
    borderRadius: 20,
  },
  idBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    zIndex: 5,
  },
  image: {
    width: CARD_WIDTH * 0.7,
    height: CARD_WIDTH * 0.7,
  },
  nameContainer: {
    backgroundColor: Colors.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  pokeballDecoration: {
    position: 'absolute',
    top: -20,
    left: -20,
    opacity: 0.08,
    zIndex: 1,
  },
  pokeballOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: Colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokeballLine: {
    position: 'absolute',
    width: '100%',
    height: 6,
    backgroundColor: Colors.textPrimary,
  },
  pokeballCenter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.textPrimary,
    borderWidth: 4,
    borderColor: Colors.background,
  },
});

const areEqual = (
  prevProps: PokemonCardProps,
  nextProps: PokemonCardProps
): boolean => {
  if (!prevProps.pokemon || !nextProps.pokemon) {
    return prevProps.pokemon === nextProps.pokemon;
  }
  
  return (
    prevProps.pokemon.id === nextProps.pokemon.id &&
    prevProps.pokemon.name === nextProps.pokemon.name &&
    prevProps.onPress === nextProps.onPress
  );
};

export default memo(PokemonCard, areEqual);

