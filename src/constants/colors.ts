export const colors = {
  // Backgrounds
  background: '#F5F0EB',       // warm ivory
  surface: '#FFFFFF',          // clean white
  surfaceAlt: '#EDE7E0',      // muted sand

  // Primary – soft sage green
  primary: '#7CA982',
  primaryLight: '#A3C4A8',
  primaryDark: '#5E8A64',

  // Accent – calming lavender
  accent: '#9B8EC4',
  accentLight: '#C2B8DB',
  accentDark: '#7A6DA6',

  // Secondary – dusty sky blue
  secondary: '#7BAFD4',
  secondaryLight: '#A8CEE6',
  secondaryDark: '#5A94BD',

  // Text
  textPrimary: '#2E3339',     // soft charcoal
  textSecondary: '#6B7280',   // muted slate
  textTertiary: '#9CA3AF',    // light grey
  textInverse: '#FFFFFF',

  // Borders & dividers
  border: '#D6CFC7',          // warm grey
  borderLight: '#E8E2DB',
  divider: '#EDE7E0',

  // Status
  success: '#81B29A',         // soft teal-green
  warning: '#E6C07B',         // gentle amber
  error: '#D4817B',           // muted coral
  info: '#7BAFD4',            // reuses secondary blue

  // Misc
  shadow: 'rgba(46, 51, 57, 0.08)',
  overlay: 'rgba(46, 51, 57, 0.4)',
  disabled: '#C9C3BC',
} as const;

export type ColorKey = keyof typeof colors;
