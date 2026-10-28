import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors, shadows, borderRadius, spacing, typography } from '../theme/colors';

interface HeaderProgressProps {
  completed: number;
  total: number;
}

export const HeaderProgress: React.FC<HeaderProgressProps> = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  let message = 'Hãy bắt đầu hoàn thành công việc của bạn!';
  if (total > 0) {
    if (percentage === 100) {
      message = 'Tuyệt vời! Bạn đã hoàn thành tất cả công việc!';
    } else if (percentage >= 50) {
      message = 'Tiến độ rất tốt, hãy tiếp tục phát huy nhé!';
    } else {
      message = 'Cố gắng hoàn thành thêm các mục tiêu hôm nay!';
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>Tiến độ công việc</Text>
          <Text style={styles.progressText}>
            Đã hoàn thành <Text style={styles.highlightText}>{completed}</Text>/{total} công việc
          </Text>
        </View>
        <View style={styles.percentageBadge}>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      </View>

      
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(100, Math.max(0, percentage))}%`,
              backgroundColor: percentage === 100 ? colors.success : colors.primary,
            },
          ]}
        />
      </View>

      <Text style={styles.subtitle}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  label: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  progressText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  highlightText: {
    color: colors.primary,
    fontWeight: typography.fontWeights.heavy,
  },
  percentageBadge: {
    backgroundColor: colors.primary50,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary100,
  },
  percentageText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginVertical: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  subtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
