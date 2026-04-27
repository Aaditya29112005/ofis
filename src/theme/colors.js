export const DARK_THEME = {
  // Base Colors
  background: "#0F0F10",
  surface: "#1C1C1E",
  card: "#1C1C1E",
  surfaceElevated: "#2C2C2E",
  
  // Glassmorphism Tokens
  glassBackground: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  glassAccent: "rgba(255, 126, 21, 0.1)", // Using Primary Accent
  
  // Text Colors
  text: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textMuted: "#6B7280",
  
  // UI Colors
  border: "rgba(255, 255, 255, 0.08)",
  divider: "#1A1A1A",
};

export const LIGHT_THEME = {
  // Base Colors (Maintaining High-End Light Mode based on system rules)
  background: "#F8FAFC",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  surfaceElevated: "#F1F5F9",
  
  // Glassmorphism Tokens
  glassBackground: "#FFFFFF",
  glassBorder: "#E2E8F0",
  glassAccent: "rgba(255, 126, 21, 0.05)",
  
  // Text Colors
  text: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  
  // UI Colors
  border: "#E2E8F0",
  divider: "#E5E5EA",
};

export const COLORS = {
  // STRICT Accent Orange Scale
  orange500: "#803900",
  orange400: "#BF5600",
  orange300: "#FF7E15", // Primary Accent
  orange200: "#FF9640",
  orange100: "#FFB980",

  // Brand Colors (Constant)
  primary: "#FF7E15", 
  primaryGradient: ["#FF7300", "#B25203"], 
  blueGradient: ["#225C9A", "#30BCED"],
  cardGradient: ["#1C1C1E", "#151517"],
  
  error: "#E54339",
  success: "#008136",
  warning: "#FF9F0A",
  
  // Utils
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  // Default Fallback
  ...DARK_THEME
};
