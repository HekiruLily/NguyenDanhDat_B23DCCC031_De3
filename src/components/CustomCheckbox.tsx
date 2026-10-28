import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { colors } from '../theme/colors';

interface CustomCheckboxProps {
  checked: boolean;
  onPress: () => void;
  size?: number;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onPress,
  size = 24,
}) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={({ pressed }) => [
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.3,
        },
        checked ? styles.checkedContainer : styles.uncheckedContainer,
        pressed && styles.pressed,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      {checked && (
        <View style={styles.checkmarkWrapper}>
          <Text style={[styles.checkmarkText, { fontSize: size * 0.65 }]}>✓</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  uncheckedContainer: {
    borderColor: colors.textMuted,
    backgroundColor: colors.white,
  },
  checkedContainer: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.8,
  },
  checkmarkWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 18,
  },
});
