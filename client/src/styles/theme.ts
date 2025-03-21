export const theme = {
  colors: {
    teddy: {
      beige: '#F5E6D3',
      light: '#FFF7ED',
      brown: '#8B4513',
      accent: '#A0522D',
      muted: '#D2B48C'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(139, 69, 19, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(139, 69, 19, 0.1), 0 1px 2px -1px rgba(139, 69, 19, 0.1)',
    md: '0 4px 6px -1px rgba(139, 69, 19, 0.1), 0 2px 4px -2px rgba(139, 69, 19, 0.1)',
    lg: '0 10px 15px -3px rgba(139, 69, 19, 0.1), 0 4px 6px -4px rgba(139, 69, 19, 0.1)',
  },
  blur: {
    sm: '4px',
    DEFAULT: '8px',
    lg: '12px',
  },
  spacing: {
    page: '2rem',
    section: '1.5rem',
    element: '1rem',
  },
  borderRadius: {
    sm: '0.375rem',
    DEFAULT: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  transitions: {
    DEFAULT: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  }
} as const;

export type Theme = typeof theme;

// CSS variable names for colors
export const cssVariables = {
  colors: {
    teddyBeige: 'var(--teddy-beige)',
    teddyLight: 'var(--teddy-light)',
    teddyBrown: 'var(--teddy-brown)',
    teddyAccent: 'var(--teddy-accent)',
    teddyMuted: 'var(--teddy-muted)',
  }
} as const; 