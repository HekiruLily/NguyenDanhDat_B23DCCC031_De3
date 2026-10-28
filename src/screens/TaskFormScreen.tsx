import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  RootStackParamList,
  Category,
  Priority,
  CATEGORIES,
  PRIORITIES,
} from '../types/task';
import { useTasks } from '../context/TaskContext';
import {
  validateDueDate,
  formatDate,
  getToday,
  addDays,
} from '../utils/dateUtils';
import {
  colors,
  borderRadius,
  spacing,
  typography,
  shadows,
} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

export const TaskFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { taskId } = route.params || {};
  const isEdit = Boolean(taskId);
  const { addTask, updateTask, getTaskById } = useTasks();

  
  const [title, setTitle] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [category, setCategory] = useState<Category>('Học tập');
  const [priority, setPriority] = useState<Priority>('Trung bình');
  const [dueDate, setDueDate] = useState<string>('');
  const [done, setDone] = useState<boolean>(false);

  
  const [titleError, setTitleError] = useState<string | null>(null);
  const [dueDateError, setDueDateError] = useState<string | null>(null);

  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const [keyboardPadding, setKeyboardPadding] = useState<number>(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        setKeyboardPadding(e.endCoordinates.height);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardPadding(0);
      }
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleScrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  
  useEffect(() => {
    if (taskId) {
      const existing = getTaskById(taskId);
      if (existing) {
        setTitle(existing.title);
        setNote(existing.note || '');
        setCategory(existing.category);
        setPriority(existing.priority);
        setDueDate(existing.dueDate);
        setDone(existing.done);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy công việc cần sửa', [
          { text: 'Đóng', onPress: () => navigation.goBack() },
        ]);
      }
    } else {
      
      setDueDate(formatDate(getToday()));
    }
  }, [taskId, getTaskById, navigation]);

  
  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (titleError) {
      if (text.trim().length > 0 && text.length <= 50) {
        setTitleError(null);
      }
    }
  };

  
  const handleDueDateChange = (text: string) => {
    setDueDate(text);
    if (dueDateError) {
      const validation = validateDueDate(text, isEdit);
      if (validation.isValid) {
        setDueDateError(null);
      }
    }
  };

  
  const setQuickDate = (daysAhead: number) => {
    const targetDate = addDays(getToday(), daysAhead);
    const formatted = formatDate(targetDate);
    setDueDate(formatted);
    setDueDateError(null);
  };

  
  const handleSubmit = async () => {
    let hasError = false;

    
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      setTitleError('Tên công việc không được để trống');
      hasError = true;
    } else if (title.length > 50) {
      setTitleError(`Tên công việc không được vượt quá 50 ký tự (hiện tại: ${title.length} ký tự)`);
      hasError = true;
    } else {
      setTitleError(null);
    }

    
    const dateValidation = validateDueDate(dueDate, isEdit);
    if (!dateValidation.isValid) {
      setDueDateError(dateValidation.error || 'Hạn hoàn thành không hợp lệ');
      hasError = true;
    } else {
      setDueDateError(null);
    }

    if (hasError) return;

    try {
      if (isEdit && taskId) {
        await updateTask({
          id: taskId,
          title: trimmedTitle,
          note: note.trim() || undefined,
          category,
          priority,
          dueDate: dueDate.trim(),
          done,
        });
        Alert.alert('Thành công', 'Đã cập nhật công việc thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await addTask({
          title: trimmedTitle,
          note: note.trim() || undefined,
          category,
          priority,
          dueDate: dueDate.trim(),
          done: false,
        });
        Alert.alert('Thành công', 'Đã thêm công việc mới thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Lỗi', 'Không thể lưu công việc. Vui lòng thử lại.');
    }
  };

  const getPriorityStyle = (p: Priority) => {
    const isSelected = priority === p;
    switch (p) {
      case 'Cao':
        return {
          btnStyle: isSelected ? styles.priorityCaoActive : styles.priorityInactive,
          textStyle: isSelected ? styles.priorityTextActive : styles.priorityCaoText,
        };
      case 'Trung bình':
        return {
          btnStyle: isSelected ? styles.priorityTBActive : styles.priorityInactive,
          textStyle: isSelected ? styles.priorityTextActive : styles.priorityTBText,
        };
      case 'Thấp':
      default:
        return {
          btnStyle: isSelected ? styles.priorityThapActive : styles.priorityInactive,
          textStyle: isSelected ? styles.priorityTextActive : styles.priorityThapText,
        };
    }
  };

  const dynamicScrollContentStyle = {
    paddingBottom: keyboardPadding > 0 ? keyboardPadding + 80 : spacing.xxl,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
          <Text style={styles.navTitle}>
            {isEdit ? 'Sửa công việc' : 'Thêm việc mới'}
          </Text>
          <View style={styles.navRightPlaceholder} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, dynamicScrollContentStyle]}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          {}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Tên công việc <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <Text
                style={[
                  styles.charCounter,
                  title.length > 50 && styles.charCounterError,
                ]}
              >
                {title.length}/50
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                titleError ? styles.inputError : null,
              ]}
              placeholder="Nhập tên công việc (tối đa 50 ký tự)..."
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={handleTitleChange}
              maxLength={50}
              autoCapitalize="sentences"
            />
            {}
            {Boolean(titleError) && (
              <Text style={styles.errorText}>⚠️ {titleError}</Text>
            )}
          </View>

          {}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Danh mục <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <View style={styles.chipsGrid}>
              {CATEGORIES.map(cat => {
                const isSelected = category === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                      pressed && styles.btnPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat === 'Học tập'
                        ? '📚 Học tập'
                        : cat === 'Công việc'
                        ? '💼 Công việc'
                        : cat === 'Sức khoẻ'
                        ? '🏃 Sức khoẻ'
                        : '👤 Cá nhân'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Mức ưu tiên <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map(p => {
                const isSelected = priority === p;
                const { btnStyle, textStyle } = getPriorityStyle(p);
                return (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    style={({ pressed }) => [
                      styles.priorityBtn,
                      btnStyle,
                      pressed && styles.btnPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={[styles.priorityBtnText, textStyle]}>
                      {p === 'Cao'
                        ? '🔴 Cao'
                        : p === 'Trung bình'
                        ? '🟡 Trung bình'
                        : '🟢 Thấp'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Hạn hoàn thành (dd/mm/yyyy) <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                dueDateError ? styles.inputError : null,
              ]}
              placeholder="dd/mm/yyyy (ví dụ: 30/10/2026)"
              placeholderTextColor={colors.textMuted}
              value={dueDate}
              onChangeText={handleDueDateChange}
              keyboardType="numeric"
              maxLength={10}
            />
            {}
            {Boolean(dueDateError) && (
              <Text style={styles.errorText}>⚠️ {dueDateError}</Text>
            )}

            {}
            <View style={styles.quickDateRow}>
              <Text style={styles.quickDateLabel}>Chọn nhanh:</Text>
              <Pressable
                onPress={() => setQuickDate(0)}
                style={styles.quickDateChip}
              >
                <Text style={styles.quickDateChipText}>Hôm nay</Text>
              </Pressable>
              <Pressable
                onPress={() => setQuickDate(1)}
                style={styles.quickDateChip}
              >
                <Text style={styles.quickDateChipText}>Ngày mai</Text>
              </Pressable>
              <Pressable
                onPress={() => setQuickDate(3)}
                style={styles.quickDateChip}
              >
                <Text style={styles.quickDateChipText}>+3 ngày</Text>
              </Pressable>
              <Pressable
                onPress={() => setQuickDate(7)}
                style={styles.quickDateChip}
              >
                <Text style={styles.quickDateChipText}>+1 tuần</Text>
              </Pressable>
            </View>
          </View>

          {}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ghi chú (không bắt buộc)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Thêm ghi chú chi tiết cho công việc này..."
              placeholderTextColor={colors.textMuted}
              value={note}
              onChangeText={setNote}
              onFocus={handleScrollToBottom}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {}
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && styles.submitBtnPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.submitBtnText}>
              {isEdit ? '💾 Lưu thay đổi' : '✨ Tạo công việc'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
  navRightPlaceholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  requiredAsterisk: {
    color: colors.error,
  },
  charCounter: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
  charCounterError: {
    color: colors.error,
    fontWeight: typography.fontWeights.bold,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: typography.fontSizes.base,
    color: colors.text,
    ...shadows.small,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
    backgroundColor: colors.errorBg,
  },
  textArea: {
    minHeight: 90,
  },
  errorText: {
    fontSize: typography.fontSizes.xs,
    color: colors.error,
    fontWeight: typography.fontWeights.medium,
    marginTop: 6,
    marginLeft: 2,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary50,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
  },
  categoryChipTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...shadows.small,
  },
  priorityInactive: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  priorityCaoActive: {
    backgroundColor: colors.priorityHigh,
    borderColor: colors.priorityHigh,
  },
  priorityCaoText: {
    color: colors.priorityHighText,
  },
  priorityTBActive: {
    backgroundColor: colors.priorityMedium,
    borderColor: colors.priorityMedium,
  },
  priorityTBText: {
    color: colors.priorityMediumText,
  },
  priorityThapActive: {
    backgroundColor: colors.priorityLow,
    borderColor: colors.priorityLow,
  },
  priorityThapText: {
    color: colors.priorityLowText,
  },
  priorityBtnText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  priorityTextActive: {
    color: colors.white,
  },
  quickDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  quickDateLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginRight: 4,
  },
  quickDateChip: {
    backgroundColor: colors.cardAlt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickDateChipText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.base,
    ...shadows.medium,
  },
  submitBtnPressed: {
    backgroundColor: colors.primaryHover,
    transform: [{ scale: 0.98 }],
  },
  submitBtnText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
