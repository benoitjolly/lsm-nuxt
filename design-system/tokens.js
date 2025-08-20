/**
 * Design System Tokens
 * Basé sur l'analyse des composants existants du projet LSM
 */

export const designTokens = {
  // === COULEURS ===
  colors: {
    // Couleur primaire (indigo - utilisée pour les actions principales)
    primary: {
      50: '#eef2ff',   // Arrière-plans très clairs
      100: '#e0e7ff',  // Badges, backgrounds légers
      200: '#c7d2fe',  // Éléments interactifs passifs
      300: '#a5b4fc',  // Borders hover
      400: '#818cf8',  // Éléments secondaires
      500: '#6366f1',  // Focus rings
      600: '#4f46e5',  // Boutons principaux, liens
      700: '#4338ca',  // Boutons hover
      800: '#3730a3',  // Textes d'accent
      900: '#312e81',  // Textes très foncés
    },
    
    // Couleurs neutres (gris - utilisées pour les textes et éléments de structure)
    neutral: {
      50: '#f9fafb',   // Arrière-plans très clairs
      100: '#f3f4f6',  // Arrière-plans clairs
      200: '#e5e7eb',  // Borders, séparateurs
      300: '#d1d5db',  // Borders, inputs
      400: '#9ca3af',  // Icônes, placeholders
      500: '#6b7280',  // Textes secondaires
      600: '#4b5563',  // Textes
      700: '#374151',  // Textes principaux
      800: '#1f2937',  // Textes très sombres
      900: '#111827',  // Textes maximums
    },
    
    // Couleurs d'état - Succès (non utilisée dans les composants actuels mais prévue)
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    
    // Couleurs d'état - Erreur (rouge - utilisée pour les erreurs et actions destructrices)
    error: {
      50: '#fef2f2',   // Arrière-plans d'alertes
      100: '#fee2e2',  // Badges d'erreur
      400: '#f87171',  // Icônes d'erreur
      500: '#ef4444',  // Borders d'erreur
      600: '#dc2626',  // Boutons destructeurs
      700: '#b91c1c',  // Boutons destructeurs hover
      800: '#991b1b',  // Textes d'erreur sombres
    },
    
    // Couleurs d'état - Attention (jaune - utilisée pour les alertes d'attention)
    warning: {
      50: '#fffbeb',   // Arrière-plans d'alertes
      100: '#fef3c7',  // Badges d'attention
      400: '#fbbf24',  // Icônes d'attention
      700: '#a16207',  // Textes d'attention
      800: '#92400e',  // Textes d'attention sombres
    },
    
    // Couleurs spéciales
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',

    // === TOKENS SÉMANTIQUES DE COULEURS ===
    semantic: {
      // Textes
      'text-primary': '#374151',      // neutral-700
      'text-secondary': '#6b7280',    // neutral-500
      'text-tertiary': '#9ca3af',     // neutral-400
      'text-disabled': '#d1d5db',     // neutral-300
      'text-inverse': '#ffffff',      // white
      'text-accent': '#4f46e5',       // primary-600
      'text-success': '#16a34a',      // success-600
      'text-warning': '#a16207',      // warning-700
      'text-error': '#dc2626',        // error-600
      
      // Arrière-plans
      'surface-primary': '#ffffff',   // white
      'surface-secondary': '#f9fafb', // neutral-50
      'surface-tertiary': '#f3f4f6',  // neutral-100
      'surface-accent': '#4f46e5',    // primary-600
      'surface-accent-subtle': '#eef2ff', // primary-50
      'surface-success': '#16a34a',   // success-600
      'surface-success-subtle': '#f0fdf4', // success-50
      'surface-warning': '#a16207',   // warning-700
      'surface-warning-subtle': '#fffbeb', // warning-50
      'surface-error': '#dc2626',     // error-600
      'surface-error-subtle': '#fef2f2', // error-50
      
      // Bordures
      'border-primary': '#e5e7eb',    // neutral-200
      'border-secondary': '#d1d5db',  // neutral-300
      'border-accent': '#4f46e5',     // primary-600
      'border-success': '#16a34a',    // success-600
      'border-warning': '#a16207',    // warning-700
      'border-error': '#dc2626',      // error-600
      
      // États interactifs
      'interactive-primary': '#4f46e5',     // primary-600
      'interactive-primary-hover': '#4338ca', // primary-700
      'interactive-primary-active': '#3730a3', // primary-800
      'interactive-secondary': '#f3f4f6',   // neutral-100
      'interactive-secondary-hover': '#e5e7eb', // neutral-200
      'interactive-secondary-active': '#d1d5db', // neutral-300
    },
  },

  // === TYPOGRAPHIE ===
  typography: {
    // Tailles de police
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px - Labels, textes secondaires
      base: '1rem',     // 16px - Texte par défaut
      lg: '1.125rem',   // 18px - Sous-titres
      xl: '1.25rem',    // 20px - Titres de sections
      '2xl': '1.5rem',  // 24px - Titres de pages
      '3xl': '1.875rem', // 30px - Titres principaux
      '4xl': '2.25rem', // 36px - Titres héros
    },
    
    // Poids de police
    fontWeight: {
      normal: '400',
      medium: '500',    // Labels, textes importants
      semibold: '600',  // Sous-titres
      bold: '700',      // Titres
    },
    
    // Hauteurs de ligne
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    
    // Familles de polices
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    },

    // === TOKENS SÉMANTIQUES DE TYPOGRAPHIE ===
    // Combinaisons prêtes à l'emploi
    styles: {
      // Titres
      'heading-4xl': {
        fontSize: '2.25rem', // 36px
        fontWeight: '700',
        lineHeight: '1.25',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      'heading-3xl': {
        fontSize: '1.875rem', // 30px
        fontWeight: '700',
        lineHeight: '1.25',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      'heading-2xl': {
        fontSize: '1.5rem', // 24px
        fontWeight: '600',
        lineHeight: '1.25',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      'heading-xl': {
        fontSize: '1.25rem', // 20px
        fontWeight: '600',
        lineHeight: '1.25',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      'heading-lg': {
        fontSize: '1.125rem', // 18px
        fontWeight: '600',
        lineHeight: '1.25',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      
      // Corps de texte
      'body-lg': {
        fontSize: '1.125rem', // 18px
        fontWeight: '400',
        lineHeight: '1.5',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      'body-base': {
        fontSize: '1rem', // 16px
        fontWeight: '400',
        lineHeight: '1.5',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      'body-sm': {
        fontSize: '0.875rem', // 14px
        fontWeight: '400',
        lineHeight: '1.5',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      
      // Labels et textes de support
      'label-lg': {
        fontSize: '1rem', // 16px
        fontWeight: '500',
        lineHeight: '1.5',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      'label-base': {
        fontSize: '0.875rem', // 14px
        fontWeight: '500',
        lineHeight: '1.5',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      'label-sm': {
        fontSize: '0.75rem', // 12px
        fontWeight: '500',
        lineHeight: '1.5',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      
      // Textes fins
      'caption': {
        fontSize: '0.75rem', // 12px
        fontWeight: '400',
        lineHeight: '1.5',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      'overline': {
        fontSize: '0.75rem', // 12px
        fontWeight: '500',
        lineHeight: '1.5',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      },
      
      // Nouveau token ajouté pour démonstration
      'heading-hero': {
        fontSize: '3rem', // 48px
        fontWeight: '800',
        lineHeight: '1.1',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        letterSpacing: '-0.025em',
      },
      
      // Liens d'authentification
      'auth-link': {
        fontSize: '0.875rem', // 14px
        fontWeight: '500',
        lineHeight: '1.5',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#4f46e5', // primary-600
        textDecoration: 'none',
        transition: 'color 0.15s ease-in-out',
      },
      
      // Texte de séparateur
      'separator-text': {
        fontSize: '0.875rem', // 14px
        fontWeight: '400',
        lineHeight: '1.5',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#6b7280', // neutral-500
        backgroundColor: '#f9fafb', // neutral-50
        padding: '0 0.5rem',
      },
    },
  },

  // === ESPACEMENTS ===
  spacing: {
    // Espacements internes et externes
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px - Espacement standard
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px - Espacement entre sections
    8: '2rem',      // 32px - Espacement large
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px - Espacement très large
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // === BORDURES ===
  borders: {
    // Épaisseurs
    width: {
      0: '0',
      DEFAULT: '1px',
      2: '2px',
      4: '4px',
    },
    
    // Couleurs de bordure
    color: {
      default: '#e5e7eb',    // neutral-200
      light: '#f3f4f6',      // neutral-100
      medium: '#d1d5db',     // neutral-300
      primary: '#4f46e5',    // primary-600
      error: '#dc2626',      // error-600
      transparent: 'transparent',
    },
    
    // Rayons de bordure
    radius: {
      none: '0',
      sm: '0.125rem',   // 2px
      DEFAULT: '0.25rem', // 4px
      md: '0.375rem',   // 6px - Radius standard
      lg: '0.5rem',     // 8px - Cards
      xl: '0.75rem',    // 12px
      full: '9999px',   // Pills, badges
    },
  },

  // === OMBRES ===
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',           // Éléments légers
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // Cards
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Éléments surélevés
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Modales
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // Éléments très surélevés
  },

  // === TRANSITIONS ===
  transitions: {
    // Durées
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',   // Transition standard
      200: '200ms',
      300: '300ms',   // Transition lente
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    
    // Fonctions d'ease
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // Ease standard
    },
    
    // Propriétés communes
    property: {
      colors: 'color, background-color, border-color',
      transform: 'transform',
      opacity: 'opacity',
      shadow: 'box-shadow',
      all: 'all',
    },
  },

  // === GRILLES ET LAYOUTS ===
  layout: {
    // Largeurs de conteneur
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
    // Colonnes de grille
    gridCols: {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      6: '6',
      12: '12',
    },
    
    // Gaps
    gap: {
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
    },
  },

  // === Z-INDEX ===
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
    overlay: '1080',
  },


}

export default designTokens 