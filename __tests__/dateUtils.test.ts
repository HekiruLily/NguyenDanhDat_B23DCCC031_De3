import {
  parseDate,
  formatDate,
  isOverdue,
  getRemainingDaysInfo,
  validateDueDate,
  getToday,
  addDays,
} from '../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('parseDate & formatDate', () => {
    it('should parse valid dates correctly', () => {
      const date = parseDate('25/12/2026');
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(11); // December is 11
      expect(date?.getDate()).toBe(25);
    });

    it('should reject invalid calendar dates such as 31/02/2026', () => {
      expect(parseDate('31/02/2026')).toBeNull();
      expect(parseDate('29/02/2025')).toBeNull(); // 2025 is not a leap year
      expect(parseDate('31/04/2026')).toBeNull(); // April has 30 days
      expect(parseDate('32/01/2026')).toBeNull();
      expect(parseDate('15/13/2026')).toBeNull();
      expect(parseDate('invalid-date')).toBeNull();
    });

    it('should format date object into dd/mm/yyyy', () => {
      const d = new Date(2026, 4, 9); // May 9, 2026
      expect(formatDate(d)).toBe('09/05/2026');
    });
  });

  describe('isOverdue', () => {
    it('should return false if task is already done', () => {
      const pastDate = formatDate(addDays(getToday(), -5));
      expect(isOverdue(pastDate, true)).toBe(false);
    });

    it('should return true if task is NOT done and due date is in the past', () => {
      const pastDate = formatDate(addDays(getToday(), -3));
      expect(isOverdue(pastDate, false)).toBe(true);
    });

    it('should return false if task is NOT done and due date is in the future or today', () => {
      const todayDate = formatDate(getToday());
      const futureDate = formatDate(addDays(getToday(), 3));
      expect(isOverdue(todayDate, false)).toBe(false);
      expect(isOverdue(futureDate, false)).toBe(false);
    });
  });

  describe('getRemainingDaysInfo', () => {
    it('should return "Hạn hôm nay" for today', () => {
      const todayDate = formatDate(getToday());
      const info = getRemainingDaysInfo(todayDate);
      expect(info.isToday).toBe(true);
      expect(info.text).toBe('Hạn hôm nay');
    });

    it('should return "Còn X ngày" for future dates', () => {
      const futureDate = formatDate(addDays(getToday(), 5));
      const info = getRemainingDaysInfo(futureDate);
      expect(info.isOverdue).toBe(false);
      expect(info.text).toBe('Còn 5 ngày');
    });

    it('should return "Quá hạn X ngày" for past dates', () => {
      const pastDate = formatDate(addDays(getToday(), -4));
      const info = getRemainingDaysInfo(pastDate);
      expect(info.isOverdue).toBe(true);
      expect(info.text).toBe('Quá hạn 4 ngày');
    });
  });

  describe('validateDueDate', () => {
    it('should reject empty date string', () => {
      const res = validateDueDate('');
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('Hạn hoàn thành không được để trống');
    });

    it('should reject wrong format', () => {
      const res = validateDueDate('2026-10-30');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('đúng định dạng dd/mm/yyyy');
    });

    it('should reject non-existent calendar date (e.g. 31/02/2026)', () => {
      const res = validateDueDate('31/02/2026');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('không có thật trên lịch');
    });

    it('should reject past date when adding new task (isEdit = false)', () => {
      const pastDate = formatDate(addDays(getToday(), -2));
      const res = validateDueDate(pastDate, false);
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('Hạn hoàn thành không được trước ngày hôm nay');
    });

    it('should accept valid future date or today for new task', () => {
      const futureDate = formatDate(addDays(getToday(), 2));
      const res = validateDueDate(futureDate, false);
      expect(res.isValid).toBe(true);
    });

    it('should allow past date when editing an existing task (isEdit = true)', () => {
      const pastDate = formatDate(addDays(getToday(), -2));
      const res = validateDueDate(pastDate, true);
      expect(res.isValid).toBe(true);
    });
  });
});
