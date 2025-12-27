/**
 * Animated stat bar component for displaying Pokemon stats.
 * Color-coded based on stat value.
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
import Colors from '../utils/colors';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

/**
 * Gets color based on stat percentage
 */
const getStatColor = (percentage: number): string => {
  if (percentage >= 0.8) return '#2EC4B6'; // Excellent - Teal
  if (percentage >= 0.6) return '#78C850'; // Good - Green
  if (percentage >= 0.4) return '#F4A261'; // Average - Orange
  return '#E63946'; // Low - Red
};

/**
 * Formats stat name for display
 */
const formatStatName = (name: string): string => {
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SP.ATK',
    'special-defense': 'SP.DEF',
    speed: 'SPD',
  };
  return statNames[name] || name.toUpperCase();
};

/**
 * StatBar - Animated progress bar for displaying Pokemon stats
 * 
 * @param label - Stat name
 * @param value - Current stat value
 * @param maxValue - Maximum possible value (default: 255)
 * @param color - Optional override color
 */
const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  maxValue = 255,
  color,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const percentage = Math.min(value / maxValue, 1);
  const barColor = color || getStatColor(percentage);

  useEffect(() => {
    if (containerWidth > 0) {
      Animated.timing(animatedWidth, {
        toValue: percentage,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [percentage, animatedWidth, containerWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && containerWidth !== width) {
      setContainerWidth(width);
    }
  };

  const animatedWidthValue = containerWidth > 0
    ? animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: [0, containerWidth],
      })
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{formatStatName(label)}</Text>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>

      <View style={styles.barContainer}>
        <View
          style={styles.barBackground}
          onLayout={handleLayout}
        >
          <Animated.View
            style={[
              styles.barFill,
              {
                backgroundColor: barColor,
                width: animatedWidthValue,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    width: 60,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  valueContainer: {
    width: 40,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  barContainer: {
    flex: 1,
  },
  barBackground: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default memo(StatBar);

