export type Category = 'Học tập' | 'Công việc' | 'Sức khoẻ' | 'Cá nhân';

export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export interface Task {
  id: string;
  title: string;
  note?: string;
  category: Category;
  priority: Priority;
  dueDate: string; 
  done: boolean;
}

export type FilterStatus = 'ALL' | 'UNFINISHED' | 'FINISHED' | 'OVERDUE';

export type SortOption = 'DUE_DATE' | 'PRIORITY';

export const CATEGORIES: Category[] = ['Học tập', 'Công việc', 'Sức khoẻ', 'Cá nhân'];

export const PRIORITIES: Priority[] = ['Cao', 'Trung bình', 'Thấp'];

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string };
  TaskForm: { taskId?: string }; 
};
