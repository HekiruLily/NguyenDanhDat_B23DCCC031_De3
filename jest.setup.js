// Jest setup file
/* eslint-disable no-undef */

const mockStorage: Record<string, string> = {};

const mockAsyncStorage = {
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
    return Promise.resolve(null);
  }),
  getItem: jest.fn((key: string) => {
    return Promise.resolve(mockStorage[key] ?? null);
  }),
  removeItem: jest.fn((key: string) => {
    delete mockStorage[key];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    return Promise.resolve(null);
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(mockStorage))),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const { View } = require('react-native');
  return {
    enableScreens: jest.fn(),
    ScreenContainer: View,
    Screen: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    ScreenStack: View,
    ScreenStackHeaderConfig: View,
    ScreenStackHeaderSubview: View,
    SearchBar: View,
    FullWindowOverlay: View,
  };
});
