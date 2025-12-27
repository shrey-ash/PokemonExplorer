/**
 * Footer component for FlatList pagination loading.
 * Shows spinner while loading more items and "End of list" message when no more items are available.
 */

import React, { memo } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import Colors from '../utils/colors';

interface LoadingFooterProps {
  isLoading: boolean;
  hasMore: boolean;
  itemCount: number;
}

/**
 * LoadingFooter - Footer component for FlatList pagination
 * 
 * @param isLoading - Shows spinner when true
 * @param hasMore - Indicates if more items are available
 * @param itemCount - Current number of items (to prevent showing end message on empty list)
 */
const LoadingFooter: React.FC<LoadingFooterProps> = ({
  isLoading,
  hasMore,
  itemCount,
}) => {
  if (!!isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={Colors.primary} animating={!!true} />
        <Text style={styles.loadingText}>Loading more Pokémon...</Text>
      </View>
    );
  }

  if (!!(!hasMore && itemCount > 0)) {
    return (
      <View style={styles.container}>
        <View style={styles.endLine} />
        <Text style={styles.endText}>You've caught 'em all! 🎉</Text>
        <View style={styles.endLine} />
      </View>
    );
  }

  return <View style={styles.spacer} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  endLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  endText: {
    fontSize: 14,
    color: Colors.textMuted,
    paddingHorizontal: 16,
  },
  spacer: {
    height: 20,
  },
});

export default memo(LoadingFooter);

