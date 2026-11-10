/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#182230',
    tint: '#174B9B',

    // Core surfaces
    background: '#FFFFFF',
    foreground: '#182230',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#182230',

    // Primary action color (buttons, links, active states)
    primary: '#174B9B',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#EEF1F5',
    secondaryForeground: '#182230',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#EEF1F5',
    mutedForeground: '#667085',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#A6D93D',
    accentForeground: '#182230',

    // Destructive actions (delete, error states)
    destructive: '#C73838',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#DCE2EA',
    input: '#DCE2EA',
    success: '#2D7A46',
    successSoft: '#E7F4EA',
    warning: '#9A6500',
    warningSoft: '#FFF4D8',
    dangerSoft: '#FDECEC',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 16,
};

export default colors;
