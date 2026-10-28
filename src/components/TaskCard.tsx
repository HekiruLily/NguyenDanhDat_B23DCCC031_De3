import React from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import { Task, Priority, Category } from '../types/task';
import { CustomCheckbox } from './CustomCheckbox';
import { isOverdue } from '../utils/dateUtils';
import {
  colors,
  shadows,
  borderRadius,
  spacing,
  typography,
} from '../theme/colors';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleDone: () => void;
  onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggleDone,
  onDelete,
}) => {
  const overdue = isOverdue(task.dueDate, task.done);

  const handleLongPress = () => {
    Alert.alert(
      'Xoá công việc',
      `Bạn có chắc chắn muốn xoá công việc "${task.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: onDelete,
        },
      ],
      { cancelable: true }
    );
  };

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'Cao':
        return {
          textColor: colors.priorityHighText,
          bg: colors.priorityHighBg,
          border: colors.priorityHighBorder,
          label: 'Cao',
        };
      case 'Trung bình':
        return {
          textColor: colors.priorityMediumText,
          bg: colors.priorityMediumBg,
          border: colors.priorityMediumBorder,
          label: 'Trung bình',
        };
      case 'Thấp':
      default:
        return {
          textColor: colors.priorityLowText,
          bg: colors.priorityLowBg,
          border: colors.priorityLowBorder,
          label: 'Thấp',
        };
    }
  };

  const getCategoryStyle = (category: Category) => {
    switch (category) {
      case 'Học tập':
        return {
          textColor: colors.categoryStudy,
          bg: colors.categoryStudyBg,
          icon: '📚',
        };
      case 'Công việc':
        return {
          textColor: colors.categoryWork,
          bg: colors.categoryWorkBg,
          icon: '💼',
        };
      case 'Sức khoẻ':
        return {
          textColor: colors.categoryHealth,
          bg: colors.categoryHealthBg,
          icon: '🏃',
        };
      case 'Cá nhân':
      default:
        return {
          textColor: colors.categoryPersonal,
          bg: colors.categoryPersonalBg,
          icon: '👤',
        };
    }
  };

  const priorityStyle = getPriorityStyle(task.priority);
  const categoryStyle = getCategoryStyle(task.category);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={450}
      style={({ pressed }) => [
        styles.card,
        task.done && styles.cardCompleted,
        overdue && styles.cardOverdue,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Công việc: ${task.title}`}
    >
      <View style={styles.contentRow}>
        {}
        <View style={styles.checkboxWrapper}>
          <CustomCheckbox checked={task.done} onPress={onToggleDone} size={24} />
        </View>

        {}
        <View style={styles.infoContainer}>
          {}
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                task.done && styles.titleCompleted,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
          </View>

          {}
          {Boolean(task.note) && (
            <Text
              style={[
                styles.note,
                task.done && styles.textCompleted,
              ]}
              numberOfLines={1}
            >
              {task.note}
            </Text>
          )}

          {}
          <View style={styles.badgesRow}>
            {}
            <View
              style={[
                styles.badge,
                { backgroundColor: categoryStyle.bg },
              ]}
            >
              <Text style={styles.badgeIcon}>{categoryStyle.icon}</Text>
              <Text
                style={[
                  styles.badgeText,
                  { color: categoryStyle.textColor },
                ]}
              >
                {task.category}
              </Text>
            </View>

            {}
            <View
              style={[
                styles.badge,
                styles.priorityBadge,
                {
                  backgroundColor: priorityStyle.bg,
                  borderColor: priorityStyle.border,
                },
              ]}
            >
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: priorityStyle.textColor },
                ]}
              />
              <Text
                style={[
                  styles.badgeText,
                  styles.priorityBadgeText,
                  { color: priorityStyle.textColor },
                ]}
              >
                {priorityStyle.label}
              </Text>
            </View>

            {}
            <View
              style={[
                styles.badge,
                styles.dateBadge,
                overdue && styles.dateBadgeOverdue,
              ]}
            >
              <Text style={styles.dateIcon}>📅</Text>
              <Text
                style={[
                  styles.dateText,
                  overdue && styles.dateTextOverdue,
                ]}
              >
                {task.dueDate}
              </Text>
            </View>

            {}
            {overdue && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueText}>Quá hạn</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: colors.border,
    opacity: 0.72,
  },
  cardOverdue: {
    borderColor: colors.overdueBorder,
    borderLeftWidth: 4,
    borderLeftColor: colors.overdue,
  },
  cardPressed: {
    backgroundColor: colors.cardPressed,
    transform: [{ scale: 0.99 }],
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxWrapper: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    lineHeight: typography.lineHeights.normal,
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  note: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeights.tight,
  },
  textCompleted: {
    color: colors.textMuted,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  badgeIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  badgeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  priorityBadge: {
    borderWidth: 1,
  },
  priorityBadgeText: {
    fontWeight: '700',
  },
  dateBadge: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateBadgeOverdue: {
    backgroundColor: colors.overdueBg,
    borderColor: colors.overdueBorder,
  },
  dateIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  dateText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  dateTextOverdue: {
    color: colors.overdue,
    fontWeight: typography.fontWeights.bold,
  },
  overdueBadge: {
    backgroundColor: colors.overdueBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.overdueBorder,
  },
  overdueText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.overdue,
  },
});
