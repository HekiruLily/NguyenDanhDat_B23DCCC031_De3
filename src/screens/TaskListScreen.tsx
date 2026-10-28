import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, FilterStatus, SortOption, Task } from '../types/task';
import { useTasks } from '../context/TaskContext';
import { HeaderProgress } from '../components/HeaderProgress';
import { TaskCard } from '../components/TaskCard';
import { FilterBar } from '../components/FilterBar';
import { SearchAndSort } from '../components/SearchAndSort';
import { EmptyState } from '../components/EmptyState';
import { parseDate, isOverdue } from '../utils/dateUtils';
import {
  colors,
  borderRadius,
  spacing,
  typography,
  shadows,
} from '../theme/colors';

type TaskListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TaskList'
>;

interface TaskListScreenProps {
  navigation: TaskListScreenNavigationProp;
}

export const TaskListScreen: React.FC<TaskListScreenProps> = ({ navigation }) => {
  const {
    tasks,
    loading,
    toggleTaskDone,
    deleteTask,
    deleteCompletedTasks,
    completedCount,
    totalCount,
  } = useTasks();

  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('DUE_DATE');

  
  const handleToggleSort = () => {
    setSortBy(prev => (prev === 'DUE_DATE' ? 'PRIORITY' : 'DUE_DATE'));
  };

  
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        
        if (filter === 'UNFINISHED') return !task.done;
        if (filter === 'FINISHED') return task.done;
        if (filter === 'OVERDUE') return isOverdue(task.dueDate, task.done);
        return true;
      })
      .filter(task => {
        
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase().trim();
        return task.title.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        
        if (sortBy === 'PRIORITY') {
          const priorityWeights = { Cao: 3, 'Trung bình': 2, Thấp: 1 };
          const weightDiff = priorityWeights[b.priority] - priorityWeights[a.priority];
          if (weightDiff !== 0) return weightDiff;
          
          const dateA = parseDate(a.dueDate)?.getTime() ?? Infinity;
          const dateB = parseDate(b.dueDate)?.getTime() ?? Infinity;
          return dateA - dateB;
        } else {
          
          const dateA = parseDate(a.dueDate)?.getTime() ?? Infinity;
          const dateB = parseDate(b.dueDate)?.getTime() ?? Infinity;
          return dateA - dateB;
        }
      });
  }, [tasks, filter, searchQuery, sortBy]);

  
  const filterCounts = useMemo(() => {
    let unfinished = 0;
    let finished = 0;
    let overdue = 0;

    tasks.forEach(t => {
      if (t.done) {
        finished++;
      } else {
        unfinished++;
        if (isOverdue(t.dueDate, t.done)) {
          overdue++;
        }
      }
    });

    return {
      all: tasks.length,
      unfinished,
      finished,
      overdue,
    };
  }, [tasks]);

  const renderItem = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      onToggleDone={() => toggleTaskDone(item.id)}
      onDelete={() => deleteTask(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>Kế hoạch của tôi</Text>
        </View>

        {}
        <Pressable
          onPress={() => navigation.navigate('TaskForm', {})}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Thêm việc mới"
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Thêm việc</Text>
        </Pressable>
      </View>

      {}
      <HeaderProgress completed={completedCount} total={totalCount} />

      {}
      <SearchAndSort
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onToggleSort={handleToggleSort}
        completedCount={completedCount}
        onDeleteCompleted={deleteCompletedTasks}
      />

      {}
      <FilterBar
        currentFilter={filter}
        onSelectFilter={setFilter}
        counts={filterCounts}
      />

      {}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải danh sách công việc...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedTasks}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              filterType={filter}
              hasSearchQuery={searchQuery.trim().length > 0}
              onClearFilters={() => {
                setSearchQuery('');
                setFilter('ALL');
              }}
              onAddTask={() => navigation.navigate('TaskForm', {})}
            />
          }
        />
      )}

      {}
      <Pressable
        onPress={() => navigation.navigate('TaskForm', {})}
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Nút thêm công việc nhanh"
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  appTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.heavy,
    color: colors.text,
    letterSpacing: -0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: borderRadius.full,
    ...shadows.small,
  },
  addButtonPressed: {
    backgroundColor: colors.primaryHover,
    transform: [{ scale: 0.96 }],
  },
  addButtonIcon: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
    marginRight: 4,
    lineHeight: 20,
  },
  addButtonText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
  },
  listContent: {
    paddingTop: spacing.xs,
    paddingBottom: 80, 
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  fabPressed: {
    backgroundColor: colors.primaryHover,
    transform: [{ scale: 0.92 }],
  },
  fabIcon: {
    fontSize: 30,
    color: colors.white,
    fontWeight: '300',
    marginTop: -2,
  },
});
