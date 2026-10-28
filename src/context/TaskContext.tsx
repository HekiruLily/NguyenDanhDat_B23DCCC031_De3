import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Task } from '../types/task';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (taskData: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  toggleTaskDone: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteCompletedTasks: () => Promise<number>;
  getTaskById: (id: string) => Task | undefined;
  completedCount: number;
  totalCount: number;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  
  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);
      const loaded = await loadTasksFromStorage();
      setTasks(loaded);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  
  const persistAndSet = async (newTasks: Task[]) => {
    setTasks(newTasks);
    await saveTasksToStorage(newTasks);
  };

  
  const addTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    const updated = [newTask, ...tasks];
    await persistAndSet(updated);
    return newTask;
  };

  
  const updateTask = async (updatedTask: Task): Promise<void> => {
    const updated = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
    await persistAndSet(updated);
  };

  
  const toggleTaskDone = async (id: string): Promise<void> => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    await persistAndSet(updated);
  };

  
  const deleteTask = async (id: string): Promise<void> => {
    const updated = tasks.filter(t => t.id !== id);
    await persistAndSet(updated);
  };

  
  const deleteCompletedTasks = async (): Promise<number> => {
    const completedTasks = tasks.filter(t => t.done);
    const count = completedTasks.length;
    if (count > 0) {
      const remaining = tasks.filter(t => !t.done);
      await persistAndSet(remaining);
    }
    return count;
  };

  
  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(t => t.id === id);
  };

  const completedCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        toggleTaskDone,
        deleteTask,
        deleteCompletedTasks,
        getTaskById,
        completedCount,
        totalCount,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
