/**
 * Badge component for displaying Pokemon types with color coding.
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTypeColor } from '../utils/colors';

interface TypeBadgeProps {
  type: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * TypeBadge - Colored badge displaying Pokemon type
 * 
 * @param type - Pokemon type name
 * @param size - Badge size variant
 */
const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'medium' }) => {
  const backgroundColor = getTypeColor(type);
  const sizeStyles = getSizeStyles(size);

  return (
    <View style={[styles.badge, { backgroundColor }, sizeStyles.container]}>
      <Text style={[styles.text, sizeStyles.text]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
    </View>
  );
};

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return {
        container: { paddingHorizontal: 10, paddingVertical: 4 },
        text: { fontSize: 11 },
      };
    case 'large':
      return {
        container: { paddingHorizontal: 20, paddingVertical: 10 },
        text: { fontSize: 16 },
      };
    default:
      return {
        container: { paddingHorizontal: 14, paddingVertical: 6 },
        text: { fontSize: 13 },
      };
  }
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default memo(TypeBadge);

