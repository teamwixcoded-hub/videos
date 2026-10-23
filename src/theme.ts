export type Path = 'green' | 'red' | 'neutral';

export const COLORS = {
  ink: '#2a1713',
  skin: '#f3d4aa',
  hoodie: '#8b93a6',
  hoodieDark: '#6c7487',
  pants: '#3a4766',
  shoe: '#f2efe8',
  sole: '#b9b3a5',
  hair: '#1a1410',
  green: '#4caf6a',
  red: '#d9453b',
  bg: {
    green: '#2a2418',
    red: '#10131c',
    neutral: '#d8d6d0',
  },
  glow: {
    green: '#ffcf7a',
    red: '#6fa8ff',
    neutral: '#ffffff',
  },
} as const;

// CSS filter presets for the Grade component
export const GRADES: Record<Path, {saturate: number; brightness: number; sepia: number; hue: number}> = {
  green: {saturate: 1.1, brightness: 1.05, sepia: 0.15, hue: 0},
  red: {saturate: 0.55, brightness: 0.85, sepia: 0, hue: 195},
  neutral: {saturate: 1, brightness: 1, sepia: 0, hue: 0},
};
