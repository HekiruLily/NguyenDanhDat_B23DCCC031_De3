import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import {
  colors,
  borderRadius,
  spacing,
  typography,
} from '../theme/colors';

interface EmptyStateProps {
  filterType: string;
  hasSearchQuery: boolean;
  onClearFilters?: () => void;
  onAddTask?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filterType,
  hasSearchQuery,
  onClearFilters,
  onAddTask,
}) => {
  let icon = '📋';
  let title = 'Không có công việc nào';
  let description = 'Chưa có công việc nào trong danh sách. Hãy thêm một công việc mới để bắt đầu theo dõi!';

  if (hasSearchQuery) {
    icon = '🔍';
    title = 'Không tìm thấy kết quả';
    description = 'Không có công việc nào phù hợp với từ khoá tìm kiếm của bạn.';
  } else if (filterType === 'UNFINISHED') {
    icon = '🎉';
    title = 'Tuyệt vời!';
    description = 'Bạn không còn công việc nào chưa hoàn thành. Hãy thư giãn hoặc thêm việc mới!';
  } else if (filterType === 'FINISHED') {
    icon = '⏳';
    title = 'Chưa có việc hoàn thành';
    description = 'Bạn chưa hoàn thành công việc nào. Hãy tích chọn các việc đã làm xong!';
  } else if (filterType === 'OVERDUE') {
    icon = '✨';
    title = 'Không có việc quá hạn';
    description = 'Tuyệt vời! Bạn đang theo kịp tiến độ và không có công việc nào bị quá hạn.';
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.actionsRow}>
        {hasSearchQuery && onClearFilters && (
          <Pressable
            onPress={onClearFilters}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.secondaryBtnText}>Xoá tìm kiếm</Text>
          </Pressable>
        )}

        {onAddTask && (
          <Pressable
            onPress={onAddTask}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>+ Thêm việc mới</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  iconText: {
    fontSize: 34,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal,
    marginBottom: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  secondaryBtn: {
    backgroundColor: colors.cardAlt,
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
