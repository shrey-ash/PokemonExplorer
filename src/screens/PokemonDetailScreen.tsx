/**
 * Detail screen displaying expanded Pokemon information.
 * Handles missing data gracefully with fallback UI.
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { StateHandler, TypeBadge, StatBar } from '../components';
import { RootStackParamList } from '../types';
import Colors, { getTypeColor } from '../utils/colors';

const { width } = Dimensions.get('window');

type DetailRouteProp = RouteProp<RootStackParamList, 'PokemonDetail'>;
type DetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PokemonDetail'>;

/**
 * PokemonDetailScreen - Detailed view of a single Pokemon
 * 
 * Features:
 * - Large artwork display
 * - Type badges with colors
 * - Animated stat bars
 * - Abilities list
 * - Physical characteristics
 * - Error handling with retry
 */
const PokemonDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavigationProp>();
  const insets = useSafeAreaInsets();

  const params = route.params ?? {};
  const pokemonId = typeof params.pokemonId === 'number' ? params.pokemonId : 0;
  const pokemonName =
    typeof params.pokemonName === 'string' ? params.pokemonName : 'Unknown';

  const { pokemon, isLoading, error, retry } = usePokemonDetail(pokemonId);

  const primaryType = useMemo(() => {
    if (!pokemon?.types?.length) return 'normal';
    return pokemon.types[0].type.name;
  }, [pokemon]);

  const primaryColor = getTypeColor(primaryType);

  const displayName = useMemo(() => {
    const name = pokemon?.name || pokemonName;
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [pokemon, pokemonName]);

  const imageUrl = useMemo(() => {
    if (!pokemon) return null;
    return (
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.front_default
    );
  }, [pokemon]);

  const formattedId = useMemo(() => {
    const id = pokemon?.id || pokemonId;
    return `#${String(id).padStart(3, '0')}`;
  }, [pokemon, pokemonId]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <StateHandler
        isLoading={!!isLoading}
        error={error}
        isEmpty={!!false}
        onRetry={retry}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={!!false}
          bounces={!!true}
        >
          <View style={[styles.headerSection, { backgroundColor: primaryColor }]}>
            <TouchableOpacity
              style={[styles.backButton, { top: insets.top + 10 }]}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <View style={styles.backArrow}>
                <View style={styles.arrowLine1} />
                <View style={styles.arrowLine2} />
              </View>
            </TouchableOpacity>

            <View style={[styles.idBadge, { top: insets.top + 16 }]}>
              <Text style={styles.idText}>{formattedId}</Text>
            </View>

            <View style={styles.pokeballDecoration}>
              <View style={styles.pokeballOuter}>
                <View style={styles.pokeballLine} />
                <View style={styles.pokeballCenter} />
              </View>
            </View>

            <View style={styles.imageContainer}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>?</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.contentSection}>
            <View style={styles.nameSection}>
              <Text style={styles.pokemonName}>{displayName}</Text>

              {pokemon?.types && (
                <View style={styles.typesContainer}>
                  {pokemon.types.map((typeInfo) => (
                    <View key={typeInfo.type.name} style={{ marginRight: 8 }}>
                      <TypeBadge
                        type={typeInfo.type.name}
                        size="medium"
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>

            {pokemon && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Physical Info</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoValue}>
                      {(pokemon.height / 10).toFixed(1)} m
                    </Text>
                    <Text style={styles.infoLabel}>Height</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoItem}>
                    <Text style={styles.infoValue}>
                      {(pokemon.weight / 10).toFixed(1)} kg
                    </Text>
                    <Text style={styles.infoLabel}>Weight</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoItem}>
                    <Text style={styles.infoValue}>{pokemon.base_experience}</Text>
                    <Text style={styles.infoLabel}>Base XP</Text>
                  </View>
                </View>
              </View>
            )}

            {pokemon?.stats && (
              <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Base Stats</Text>
                <View style={styles.statsContainer}>
                  {pokemon.stats.map((statInfo) => (
                    <StatBar
                      key={statInfo.stat.name}
                      label={statInfo.stat.name}
                      value={statInfo.base_stat}
                    />
                  ))}
                </View>
              </View>
            )}

            {pokemon?.abilities && (
              <View style={styles.abilitiesSection}>
                <Text style={styles.sectionTitle}>Abilities</Text>
                <View style={styles.abilitiesContainer}>
                  {pokemon.abilities.map((abilityInfo) => (
                    <View
                      key={abilityInfo.ability.name}
                      style={[
                        styles.abilityBadge,
                        abilityInfo.is_hidden && styles.hiddenAbility,
                      ]}
                    >
                      <Text style={styles.abilityText}>
                        {abilityInfo.ability.name.replace('-', ' ')}
                      </Text>
                      {abilityInfo.is_hidden && (
                        <Text style={styles.hiddenLabel}>Hidden</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={{ height: insets.bottom + 24 }} />
          </View>
        </ScrollView>
      </StateHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    height: width * 0.9,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backArrow: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLine1: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: Colors.white,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }, { translateY: -3 }],
  },
  arrowLine2: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: Colors.white,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }, { translateY: 3 }],
  },
  idBadge: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 10,
  },
  idText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 1,
  },
  pokeballDecoration: {
    position: 'absolute',
    top: -50,
    right: -50,
    opacity: 0.15,
  },
  pokeballOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 12,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokeballLine: {
    position: 'absolute',
    width: '100%',
    height: 12,
    backgroundColor: Colors.white,
  },
  pokeballCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.white,
    borderWidth: 8,
    borderColor: 'transparent',
  },
  imageContainer: {
    width: width * 0.65,
    height: width * 0.65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 60,
    color: Colors.white,
    fontWeight: '700',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  nameSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  typesContainer: {
    flexDirection: 'row',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  abilitiesSection: {
    marginBottom: 24,
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  abilityBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10,
    marginBottom: 10,
  },
  hiddenAbility: {
    borderColor: Colors.accent,
    borderStyle: 'dashed',
  },
  abilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
  hiddenLabel: {
    fontSize: 10,
    color: Colors.accent,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default PokemonDetailScreen;

