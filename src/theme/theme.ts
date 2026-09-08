// Design tokens for Paperbit.
//
// Palette is built around the product's own idea: paper (the last-resort,
// always-works medium) and bits (the signal riding on top of it). Backgrounds
// stay near-black per the web app's own theme-color (#131313); the warm
// "paper" ink and a stamped-amber accent keep it from reading as a generic
// dark dashboard. Red is reserved exclusively for SOS/emergency states so it
// never competes with everyday status color.

export const colors = {
  bg: "#121214",
  surface: "#1B1B1E",
  surfaceRaised: "#232327",
  border: "#2C2C30",
  borderStrong: "#3A3A3F",

  ink: "#F2EFE7", // paper-white primary text
  inkMuted: "#9B9A98",
  inkFaint: "#5F5E5C",

  accent: "#D9A441", // stamped-amber: mesh identity / primary actions
  accentMuted: "#4A3C22",

  signalGood: "#6FA97C", // muted moss — "operational"
  signalGoodMuted: "#233128",

  signalWarn: "#C98A3D",

  danger: "#D0483F", // reserved for SOS / emergency only
  dangerMuted: "#3A211E",

  link: "#5D7A9E", // mesh-line blue, used only in network graph
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 6,
  md: 12,
  lg: 18,
  pill: 999,
};

// Two families, clearly distinct roles: a system sans for reading, a
// monospace for anything that's a measurement, id, or machine-state — mesh
// diagnostics should look like diagnostics.
export const typography = {
  sans: undefined as string | undefined, // undefined -> RN system font
  mono: "monospace",
  size: {
    xs: 12,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
};

export const theme = { colors, spacing, radii, typography };
export type Theme = typeof theme;
