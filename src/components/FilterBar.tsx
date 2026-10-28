import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { FilterStatus } from '../types/task';
import {
  colors,
  borderRadius,
  spacing,
  typography,
  shadows,
} from '../theme/colors';

interface FilterItem {
  key: FilterStatus;
  label: string;
  count: number;
}

interface FilterBarProps {
  currentFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
  counts: {
    all: number;
    unfinished: number;
    finished: number;
    overdue: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onSelectFilter,
  counts,
}) => {
  const filterOptions: FilterItem[] = [
    { key: 'ALL', label: 'Tất cả', count: counts.all },
    { key: 'UNFINISHED', label: 'Chưa xong', count: counts.unfinished },
    { key: 'FINISHED', label: 'Đã xong', count: counts.finished },
    { key: 'OVERDUE', label: 'Quá hạn', count: counts.overdue },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filterOptions.map(option => {
          const isSelected = currentFilter === option.key;
          const isOverdueTab = option.key === 'OVERDUE';

          return (
            <Pressable
              key={option.key}
              onPress={() => onSelectFilter(option.key)}
              style={({ pressed }) => [
                styles.button,
                isSelected && (isOverdueTab ? styles.buttonActiveOverdue : styles.buttonActive),
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.buttonText,
                  isSelected && styles.buttonTextActive,
                  !isSelected && isOverdueTab && option.count > 0 && styles.overdueWarningText,
                ]}
              >
                {option.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  isSelected
                    ? styles.countBadgeActive
                    : isOverdueTab && option.count > 0
                    ? styles.countBadgeOverdue
                    : styles.countBadgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    isSelected && styles.countTextActive,
                    !isSelected && isOverdueTab && option.count > 0 && styles.countTextOverdue,
                  ]}
                >
                  {option.count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  buttonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonActiveOverdue: {
    backgroundColor: colors.overdue,
    borderColor: colors.overdue,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  buttonText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
    marginRight: 6,
  },
  buttonTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
  overdueWarningText: {
    color: colors.overdue,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeInactive: {
    backgroundColor: colors.cardAlt,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  countBadgeOverdue: {
    backgroundColor: colors.overdueBg,
  },
  countText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
  },
  countTextActive: {
    color: colors.white,
  },
  countTextOverdue: {
    color: colors.overdue,
  },
});
