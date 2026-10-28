/**
 * TaskDetailScreen - View Task Details and Actions
 * Implements Câu 4 & Câu 7 requirements:
 * - Displays complete task information
 * - Edit button and Toggle Complete / Incomplete button
 * - Overdue warning badge in red for unfinished overdue tasks
 * - Remaining days calculation ("Còn 3 ngày", "Hạn hôm nay", "Quá hạn 2 ngày")
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Priority, Category } from '../types/task';
import { useTasks } from '../context/TaskContext';
import { getRemainingDaysInfo, isOverdue } from '../utils/dateUtils';
import {
  colors,
  borderRadius,
  spacing,
  typography,
  shadows,
} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { taskId } = route.params;
  const { getTaskById, toggleTaskDone, deleteTask } = useTasks();

  const task = getTaskById(taskId);

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Không tìm thấy công việc</Text>
          <Text style={styles.errorDescription}>
            Công việc này có thể đã bị xoá hoặc không tồn tại.
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>Quay lại danh sách</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const overdue = isOverdue(task.dueDate, task.done);
  const remainingInfo = getRemainingDaysInfo(task.dueDate);

  
  const handleDelete = () => {
    Alert.alert(
      'Xoá công việc',
      `Bạn có chắc chắn muốn xoá công việc "${task.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            navigation.goBack();
          },
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
          dot: colors.priorityHigh,
        };
      case 'Trung bình':
        return {
          textColor: colors.priorityMediumText,
          bg: colors.priorityMediumBg,
          border: colors.priorityMediumBorder,
          label: 'Trung bình',
          dot: colors.priorityMedium,
        };
      case 'Thấp':
      default:
        return {
          textColor: colors.priorityLowText,
          bg: colors.priorityLowBg,
          border: colors.priorityLowBorder,
          label: 'Thấp',
          dot: colors.priorityLow,
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.navBackBtn,
            pressed && styles.btnPressed,
          ]}
          hitSlop={10}
        >
          <Text style={styles.navBackText}>‹ Quay lại</Text>
        </Pressable>
        <Text style={styles.navTitle}>Chi tiết công việc</Text>
        <Pressable
          onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
          style={({ pressed }) => [
            styles.navEditBtn,
            pressed && styles.btnPressed,
          ]}
          hitSlop={10}
        >
          <Text style={styles.navEditText}>Sửa</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View
          style={[
            styles.bannerCard,
            task.done
              ? styles.bannerCompleted
              : overdue
              ? styles.bannerOverdue
              : styles.bannerActive,
          ]}
        >
          <View style={styles.bannerHeader}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusIcon}>
                {task.done ? '✅' : overdue ? '⚠️' : '⏳'}
              </Text>
              <Text
                style={[
                  styles.statusText,
                  task.done && styles.statusTextCompleted,
                  overdue && styles.statusTextOverdue,
                ]}
              >
                {task.done
                  ? 'ĐÃ HOÀN THÀNH'
                  : overdue
                  ? 'CHƯA HOÀN THÀNH (QUÁ HẠN)'
                  : 'ĐANG THỰC HIỆN'}
              </Text>
            </View>

            {}
            {overdue && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueBadgeText}>Quá hạn</Text>
              </View>
            )}
          </View>

          {}
          <View style={styles.remainingBox}>
            <Text style={styles.remainingLabel}>Thời hạn công việc:</Text>
            <Text
              style={[
                styles.remainingText,
                task.done
                  ? styles.remainingTextDone
                  : overdue
                  ? styles.remainingTextOverdue
                  : remainingInfo.isToday
                  ? styles.remainingTextToday
                  : styles.remainingTextNormal,
              ]}
            >
              {task.done
                ? `Đã xong (Hạn chót: ${task.dueDate})`
                : `${remainingInfo.text} • ${task.dueDate}`}
            </Text>
          </View>
        </View>

        {}
        <View style={styles.mainCard}>
          {}
          <Text style={styles.taskTitle}>{task.title}</Text>

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
                  { backgroundColor: priorityStyle.dot },
                ]}
              />
              <Text
                style={[
                  styles.badgeText,
                  { color: priorityStyle.textColor },
                ]}
              >
                Ưu tiên {priorityStyle.label}
              </Text>
            </View>

            {}
            <View style={[styles.badge, styles.dateBadge]}>
              <Text style={styles.badgeIcon}>📅</Text>
              <Text style={styles.dateBadgeText}>{task.dueDate}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Ghi chú chi tiết</Text>
            <View style={styles.noteBox}>
              <Text style={styles.noteContent}>
                {task.note && task.note.trim().length > 0
                  ? task.note
                  : 'Chưa có ghi chú nào cho công việc này.'}
              </Text>
            </View>
          </View>
        </View>

        {}
        <View style={styles.actionsContainer}>
          {}
          <Pressable
            onPress={() => toggleTaskDone(task.id)}
            style={({ pressed }) => [
              styles.actionBtn,
              task.done ? styles.btnMarkUndone : styles.btnMarkDone,
              pressed && styles.btnPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.actionBtnText}>
              {task.done
                ? '↩️ Đánh dấu Chưa hoàn thành'
                : '✅ Đánh dấu Hoàn thành'}
            </Text>
          </Pressable>

          {}
          <Pressable
            onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.btnEdit,
              pressed && styles.btnPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.btnEditText}>✏️ Sửa thông tin công việc</Text>
          </Pressable>

          {}
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.btnDelete,
              pressed && styles.btnPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.btnDeleteText}>🗑️ Xoá công việc này</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  navBackBtn: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  navBackText: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary,
  },
  navTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  navEditBtn: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  navEditText: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  bannerCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    ...shadows.card,
  },
  bannerActive: {
    backgroundColor: colors.primary50,
    borderColor: colors.primary100,
  },
  bannerCompleted: {
    backgroundColor: colors.successBg,
    borderColor: '#A7F3D0',
  },
  bannerOverdue: {
    backgroundColor: colors.overdueBg,
    borderColor: colors.overdueBorder,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statusText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.heavy,
    letterSpacing: 0.5,
    color: colors.primary,
  },
  statusTextCompleted: {
    color: colors.success,
  },
  statusTextOverdue: {
    color: colors.overdue,
  },
  overdueBadge: {
    backgroundColor: colors.overdue,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  overdueBadgeText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  remainingBox: {
    marginTop: 4,
  },
  remainingLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  remainingText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
  remainingTextNormal: {
    color: colors.primary,
  },
  remainingTextToday: {
    color: colors.warning,
  },
  remainingTextOverdue: {
    color: colors.overdue,
  },
  remainingTextDone: {
    color: colors.success,
  },
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  taskTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    lineHeight: typography.lineHeights.relaxed,
    marginBottom: spacing.md,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  badgeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  badgeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
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
  dateBadge: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateBadgeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  section: {
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  noteBox: {
    backgroundColor: colors.cardAlt,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteContent: {
    fontSize: typography.fontSizes.base,
    color: colors.text,
    lineHeight: typography.lineHeights.normal,
  },
  actionsContainer: {
    gap: spacing.md,
  },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  btnMarkDone: {
    backgroundColor: colors.success,
  },
  btnMarkUndone: {
    backgroundColor: colors.primary,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  btnEdit: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnEditText: {
    color: colors.primary,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  btnDelete: {
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.overdueBorder,
  },
  btnDeleteText: {
    color: colors.error,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.base,
  },
  errorTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  errorDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
});
