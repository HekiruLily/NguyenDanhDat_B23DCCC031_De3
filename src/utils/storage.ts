import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';
import { formatDate, getToday, addDays } from './dateUtils';

const STORAGE_KEY = '@planner_tasks_v1';

export function getInitialSampleTasks(): Task[] {
  const today = getToday();

  return [
    {
      id: 'task-1',
      title: 'Nộp bài tập lớn Lập trình Di động',
      note: 'Hoàn thành ứng dụng PlannerApp với đầy đủ chức năng và tài liệu hướng dẫn',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: formatDate(addDays(today, -3)), 
      done: false,
    },
    {
      id: 'task-2',
      title: 'Ôn thi cuối kỳ Cơ sở dữ liệu',
      note: 'Ôn tập chương Chuẩn hoá dữ liệu (3NF, BCNF) và tối ưu hoá truy vấn SQL',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: formatDate(addDays(today, 2)), 
      done: false,
    },
    {
      id: 'task-3',
      title: 'Chuẩn bị slide báo cáo thực tập tốt nghiệp',
      note: 'Tổng hợp kết quả đề tài, chụp ảnh minh hoạ giao diện ứng dụng',
      category: 'Công việc',
      priority: 'Trung bình',
      dueDate: formatDate(today), 
      done: true, 
    },
    {
      id: 'task-4',
      title: 'Khám sức khoẻ định kỳ tại trạm y tế sinh viên',
      note: 'Mang theo thẻ BHYT và kết quả xét nghiệm tổng quát',
      category: 'Sức khoẻ',
      priority: 'Trung bình',
      dueDate: formatDate(addDays(today, 5)), 
      done: false,
    },
    {
      id: 'task-5',
      title: 'Chạy bộ 67km công viên nước trong nhà',
      note: 'Duy trì rèn luyện thể lực vào buổi sáng trước giờ lên lớp',
      category: 'Sức khoẻ',
      priority: 'Thấp',
      dueDate: formatDate(addDays(today, 1)), 
      done: false,
    },
    {
      id: 'task-6',
      title: 'Mua sách React Native & TypeScript nâng cao',
      note: 'Tìm mua trên Tiki hoặc hiệu sách Fahasa',
      category: 'Cá nhân',
      priority: 'Thấp',
      dueDate: formatDate(addDays(today, -1)), 
      done: true, 
    },
    {
      id: 'task-7',
      title: 'Gửi email báo cáo tiến độ tuần cho Giảng viên',
      note: 'Đính kèm bản thảo chương 3 và bảng tiến độ công việc',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: formatDate(addDays(today, -5)), 
      done: false,
    },
  ];
}

export async function loadTasksFromStorage(): Promise<Task[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue !== null) {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    
    const initialTasks = getInitialSampleTasks();
    await saveTasksToStorage(initialTasks);
    return initialTasks;
  } catch (error) {
    console.error('Error loading tasks from AsyncStorage:', error);
    return getInitialSampleTasks();
  }
}

export async function saveTasksToStorage(tasks: Task[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving tasks to AsyncStorage:', error);
    throw error;
  }
}

export async function resetTasksStorage(): Promise<Task[]> {
  const initialTasks = getInitialSampleTasks();
  await saveTasksToStorage(initialTasks);
  return initialTasks;
}
