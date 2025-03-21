import { theme, type Theme } from './theme';

export function getThemeColor(color: keyof Theme['colors']['teddy']): string {
  return theme.colors.teddy[color];
}

export function getThemeShadow(size: keyof Theme['shadows']): string {
  return theme.shadows[size];
}

export function getThemeSpacing(size: keyof Theme['spacing']): string {
  return theme.spacing[size];
}

export function getThemeRadius(size: keyof Theme['borderRadius']): string {
  return theme.borderRadius[size];
}

// CSS class generator for common patterns
export const themeClasses = {
  card: 'bg-white/90 backdrop-blur-DEFAULT shadow-DEFAULT rounded-DEFAULT',
  cardHover: 'hover:shadow-md transition-shadow duration-DEFAULT',
  buttonBase: 'rounded-DEFAULT px-4 py-2 font-medium transition-all duration-DEFAULT',
  buttonPrimary: 'bg-teddy-brown text-white hover:bg-teddy-accent',
  buttonSecondary: 'bg-teddy-beige/50 text-teddy-brown hover:bg-teddy-beige/70',
  input: 'rounded-DEFAULT border border-teddy-muted/20 px-3 py-2 focus:outline-none focus:border-teddy-brown/30 transition-all duration-DEFAULT',
} as const; 