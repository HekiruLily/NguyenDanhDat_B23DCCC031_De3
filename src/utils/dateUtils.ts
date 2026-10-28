export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}


export function parseDate(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const trimmed = dateStr.trim();
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900 || year > 2100) return null;

  const dateObj = new Date(year, month - 1, day);
  
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return null;
  }

  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}


export function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}


export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);
  return result;
}


export function isDateBeforeToday(dateStr: string): boolean {
  const date = parseDate(dateStr);
  if (!date) return false;
  const today = getToday();
  return date.getTime() < today.getTime();
}


export function isOverdue(dueDateStr: string, done: boolean): boolean {
  if (done) return false;
  return isDateBeforeToday(dueDateStr);
}

export interface RemainingDaysInfo {
  days: number;
  text: string;
  isOverdue: boolean;
  isToday: boolean;
}


export function getRemainingDaysInfo(dueDateStr: string): RemainingDaysInfo {
  const date = parseDate(dueDateStr);
  if (!date) {
    return { days: 0, text: 'Hạn không hợp lệ', isOverdue: false, isToday: false };
  }

  const today = getToday();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { days: 0, text: 'Hạn hôm nay', isOverdue: false, isToday: true };
  } else if (diffDays > 0) {
    return { days: diffDays, text: `Còn ${diffDays} ngày`, isOverdue: false, isToday: false };
  } else {
    return {
      days: diffDays,
      text: `Quá hạn ${Math.abs(diffDays)} ngày`,
      isOverdue: true,
      isToday: false,
    };
  }
}
export function validateDueDate(
  dateStr: string,
  isEdit: boolean = false
): { isValid: boolean; error?: string } {
  if (!dateStr || dateStr.trim().length === 0) {
    return { isValid: false, error: 'Hạn hoàn thành không được để trống' };
  }

  const trimmed = dateStr.trim();
  
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Hạn hoàn thành phải đúng định dạng dd/mm/yyyy (ví dụ: 25/11/2026)',
    };
  }

  const parsed = parseDate(trimmed);
  if (!parsed) {
    return {
      isValid: false,
      error: 'Ngày không có thật trên lịch (ví dụ: 31/02/2026 là sai)',
    };
  }

  if (!isEdit && isDateBeforeToday(trimmed)) {
    return {
      isValid: false,
      error: 'Hạn hoàn thành không được trước ngày hôm nay',
    };
  }

  return { isValid: true };
}
