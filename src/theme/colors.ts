export const colors = {
  
  primary: '#4F46E5',        
  primaryHover: '#4338CA',   
  primaryLight: '#818CF8',   
  primary50: '#EEF2FF',      
  primary100: '#E0E7FF',     

  
  priorityHigh: '#DC2626',       
  priorityHighBg: '#FEE2E2',     
  priorityHighBorder: '#FCA5A5', 
  priorityHighText: '#991B1B',   

  priorityMedium: '#D97706',       
  priorityMediumBg: '#FEF3C7',     
  priorityMediumBorder: '#FCD34D', 
  priorityMediumText: '#92400E',   

  priorityLow: '#059669',       
  priorityLowBg: '#D1FAE5',     
  priorityLowBorder: '#6EE7B7', 
  priorityLowText: '#065F46',   

  
  categoryStudy: '#2563EB',      
  categoryStudyBg: '#EFF6FF',
  categoryWork: '#7C3AED',       
  categoryWorkBg: '#F5F3FF',
  categoryHealth: '#0D9488',     
  categoryHealthBg: '#F0FDFA',
  categoryPersonal: '#EA580C',   
  categoryPersonalBg: '#FFF7ED',

  
  overdue: '#DC2626',
  overdueBg: '#FEF2F2',
  overdueBorder: '#F87171',

  
  success: '#10B981',
  successBg: '#ECFDF5',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',

  
  white: '#FFFFFF',
  background: '#F8FAFC',     
  card: '#FFFFFF',
  cardAlt: '#F1F5F9',        
  border: '#E2E8F0',         
  borderLight: '#F1F5F9',
  borderFocus: '#6366F1',

  
  text: '#0F172A',           
  textSecondary: '#475569',  
  textMuted: '#94A3B8',      
  textLight: '#CBD5E1',

  
  disabled: '#E2E8F0',
  disabledText: '#94A3B8',
  ripple: 'rgba(79, 70, 229, 0.12)',
  cardPressed: '#F8FAFC',
  buttonPressed: 'rgba(0, 0, 0, 0.08)',
};

export const typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  lineHeights: {
    tight: 18,
    normal: 22,
    relaxed: 26,
    loose: 32,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  medium: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};
