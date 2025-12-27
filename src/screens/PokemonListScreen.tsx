/**
 * Main screen displaying paginated list of Pokemon.
 * Integrates search, pull-to-refresh, and infinite scroll.
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Text,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFetchItems } from '../hooks/useFetchItems';
import { usePokemonStore } from '../store/pokemonStore';
import {
  StateHandler,
  PokemonCard,
  SearchBar,
  LoadingFooter,
} from '../components';
import { Pokemon, RootStackParamList } from '../types';
import Colors from '../utils/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PokemonList'>;

/**
 * PokemonListScreen - Main list view with search, pagination, and refresh
 * 
 * Features:
 * - Grid layout with 2 columns
 * - Search/Filter functionality
 * - Pull-to-refresh
 * - Infinite scroll pagination
 * - Loading, Empty, and Error states
 */
const PokemonListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const {
    pokemonList,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    loadInitialData,
    loadMoreData,
    refreshData,
    retryFetch,
  } = useFetchItems();

  const searchQuery = usePokemonStore((state) => state.searchQuery);
  const setSearchQuery = usePokemonStore((state) => state.setSearchQuery);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handlePokemonPress = useCallback(
    (pokemon: Pokemon) => {
      navigation.navigate('PokemonDetail', {
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
      });
    },
    [navigation]
  );

  const handleEndReached = useCallback(() => {
    if (!!(!isLoading && !isRefreshing && hasMore && !searchQuery)) {
      loadMoreData();
    }
  }, [isLoading, isRefreshing, hasMore, searchQuery, loadMoreData]);

  const renderItem: ListRenderItem<Pokemon> = useCallback(
    ({ item }) => <PokemonCard pokemon={item} onPress={handlePokemonPress} />,
    [handlePokemonPress]
  );

  const keyExtractor = useCallback(
    (item: Pokemon) => `pokemon-${item.id}`,
    []
  );

  const renderFooter = useCallback(
    () => (
      <LoadingFooter
        isLoading={!!(!isLoading && !isRefreshing && hasMore && !searchQuery)}
        hasMore={!!hasMore}
        itemCount={pokemonList.length}
      />
    ),
    [isLoading, isRefreshing, hasMore, searchQuery, pokemonList.length]
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pokédex</Text>
          <Text style={styles.subtitle}>
            Discover and explore Pokémon
          </Text>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name..."
        />
      </View>
    ),
    [searchQuery, setSearchQuery]
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={!!isRefreshing}
        onRefresh={refreshData}
        tintColor={Colors.primary}
        colors={[Colors.primary]}
        progressBackgroundColor={Colors.surface}
      />
    ),
    [isRefreshing, refreshData]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <StateHandler
        isLoading={!!(isLoading && pokemonList.length === 0)}
        error={error}
        isEmpty={!!(!isLoading && pokemonList.length === 0)}
        onRetry={retryFetch}
        emptyMessage="No Pokémon found"
        emptySubMessage={
          searchQuery
            ? `No results for "${searchQuery}". Try a different search.`
            : 'Pull down to refresh and load Pokémon.'
        }
      >
        <FlatList
          data={pokemonList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          refreshControl={refreshControl}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          windowSize={10}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          removeClippedSubviews={!!true}
          showsVerticalScrollIndicator={!!false}
          bounces={!!true}
        />
      </StateHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

export default PokemonListScreen;

