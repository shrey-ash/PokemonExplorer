/**
 * Search bar component with debounced input for filtering Pokemon list.
 */

import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Colors from '../utils/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * SearchBar - Input component for filtering Pokemon list
 * 
 * @param value - Current search value
 * @param onChangeText - Callback when search value changes
 * @param placeholder - Input placeholder text
 * @param debounceMs - Debounce delay in milliseconds (default: 300ms)
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search Pokémon...',
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const clearButtonOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChangeText = useCallback(
    (text: string) => {
      setLocalValue(text);

      Animated.timing(clearButtonOpacity, {
        toValue: text ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }).start();

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        onChangeText(text);
      }, debounceMs);
    },
    [onChangeText, debounceMs, clearButtonOpacity]
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChangeText('');
    
    Animated.timing(clearButtonOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [onChangeText, clearButtonOpacity]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <SearchIcon />
      </View>

      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        autoCorrect={!!false}
        editable={!!true}
        multiline={!!false}
        autoFocus={!!false}
        returnKeyType="search"
        clearButtonMode="never"
      />

      <Animated.View style={[styles.clearButton, { opacity: clearButtonOpacity }]}>
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ClearIcon />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const SearchIcon: React.FC = () => (
  <View style={styles.searchIcon}>
    <View style={styles.searchIconCircle} />
    <View style={styles.searchIconHandle} />
  </View>
);

const ClearIcon: React.FC = () => (
  <View style={styles.clearIcon}>
    <View style={[styles.clearLine, { transform: [{ rotate: '45deg' }] }]} />
    <View style={[styles.clearLine, { transform: [{ rotate: '-45deg' }] }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  searchIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  searchIconHandle: {
    width: 6,
    height: 2,
    backgroundColor: Colors.textMuted,
    borderRadius: 1,
    position: 'absolute',
    bottom: 2,
    right: 1,
    transform: [{ rotate: '45deg' }],
  },
  clearIcon: {
    width: 18,
    height: 18,
    backgroundColor: Colors.textMuted,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearLine: {
    position: 'absolute',
    width: 10,
    height: 2,
    backgroundColor: Colors.surface,
    borderRadius: 1,
  },
});

export default memo(SearchBar);

