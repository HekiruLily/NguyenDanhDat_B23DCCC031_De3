import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { SortOption } from '../types/task';
import {
  colors,
  borderRadius,
  spacing,
  typography,
  shadows,
} from '../theme/colors';

interface SearchAndSortProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  sortBy: SortOption;
  onToggleSort: () => void;
  completedCount: number;
  onDeleteCompleted: () => void;
}

export const SearchAndSort: React.FC<SearchAndSortProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onToggleSort,
  completedCount,
  onDeleteCompleted,
}) => {
  const handleDeleteCompletedPress = () => {
    if (completedCount === 0) return;

    Alert.alert(
      'Xoá việc đã hoàn thành',
      `Bạn có chắc chắn muốn xoá tất cả ${completedCount} công việc đã hoàn thành không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá tất cả',
          style: 'destructive',
          onPress: onDeleteCompleted,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên công việc..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={onSearchChange}
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => onSearchChange('')}
              hitSlop={8}
              style={styles.clearBtn}
            >
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {}
      <View style={styles.actionRow}>
        {}
        <Pressable
          onPress={onToggleSort}
          style={({ pressed }) => [
            styles.sortBtn,
            pressed && styles.btnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Sắp xếp hiện tại: ${
            sortBy === 'DUE_DATE' ? 'Hạn gần nhất' : 'Ưu tiên Cao đến Thấp'
          }`}
        >
          <Text style={styles.sortIcon}>
            {sortBy === 'DUE_DATE' ? '⏱️' : '⚡'}
          </Text>
          <Text style={styles.sortLabel}>Sắp xếp:</Text>
          <Text style={styles.sortValue}>
            {sortBy === 'DUE_DATE' ? 'Hạn gần nhất' : 'Ưu tiên: Cao → Thấp'}
          </Text>
        </Pressable>

        {}
        <Pressable
          onPress={handleDeleteCompletedPress}
          disabled={completedCount === 0}
          style={({ pressed }) => [
            styles.deleteCompletedBtn,
            completedCount === 0 && styles.deleteCompletedBtnDisabled,
            pressed && completedCount > 0 && styles.btnPressed,
          ]}
          accessibilityRole="button"
          accessibilityState={{ disabled: completedCount === 0 }}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
          <Text
            style={[
              styles.deleteCompletedText,
              completedCount === 0 && styles.deleteCompletedTextDisabled,
            ]}
            numberOfLines={1}
          >
            Xoá việc đã xong {completedCount > 0 ? `(${completedCount})` : ''}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xs,
  },
  searchRow: {
    marginBottom: spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    ...shadows.small,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSizes.base,
    color: colors.text,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sortBtn: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary50,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary100,
  },
  sortIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  sortLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginRight: 4,
  },
  sortValue: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
    flexShrink: 1,
  },
  deleteCompletedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.errorBg,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overdueBorder,
  },
  deleteCompletedBtnDisabled: {
    backgroundColor: colors.cardAlt,
    borderColor: colors.border,
    opacity: 0.55,
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  deleteIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  deleteCompletedText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.error,
  },
  deleteCompletedTextDisabled: {
    color: colors.textMuted,
  },
});
