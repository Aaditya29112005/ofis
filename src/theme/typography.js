/**
 * Typography Design System – Ofis Square
 * Source: Figma Design System v3.1
 *
 * Font Family: Sequel Sans
 *
 * REQUIRED FONT FILES in src/assets/fonts/:
 *   SequelSans-SemiBoldHead.ttf
 *   SequelSans-MediumBody.ttf
 *   SequelSans-BookBody.ttf
 *   SequelSans-LightBody.ttf
 *   SequelSans-SemiBoldBody.ttf
 *
 * After adding font files, run:
 *   npx react-native-asset
 */

// ─── Raw Font Declarations ──────────────────────────────────────────────────

export const FONTS = {
  // Sequel Sans variants (Figma Font File Names)
  semiBoldHead: 'SequelSans-SemiBoldHead',   // Navigation Title weight
  mediumBody:   'SequelSans-MediumBody',     // Page Title, Section Header, Button weight
  bookBody:     'SequelSans-BookBody',       // Primary Body, Caption, Small Label weight
  lightBody:    'SequelSans-LightBody',      // Secondary Body weight
  semiBoldBody: 'SequelSans-SemiBoldBody',  // Section Label weight

  // Legacy aliases — map to nearest Sequel Sans equivalent
  // Existing code using FONTS.bold / FONTS.semibold / etc. continues to work
  bold:     'SequelSans-SemiBoldHead',
  semibold: 'SequelSans-SemiBoldBody',
  medium:   'SequelSans-MediumBody',
  regular:  'SequelSans-BookBody',
  light:    'SequelSans-LightBody',
};

// ─── Font Sizes ─────────────────────────────────────────────────────────────

export const FONT_SIZE = {
  // Figma scale
  xxs:         10,
  xs:          11,  // Small Label
  sm:          12,  // Caption
  md:          13,  // Secondary Body, Section Label
  base:        15,  // Primary Body, Button Text
  lg:          17,  // Section Header
  xl:          22,  // Page Title
  xxl:         28,  // Navigation Title
  // Extended
  display:     40,
};

// ─── Line Heights (absolute px, matching Figma) ─────────────────────────────

export const LINE_HEIGHT = {
  // Figma: line-height values per style
  navigationTitle: 32,  // 28 / 32
  pageTitle:       30,  // 22 / 30
  sectionHeader:   21,  // 17 / 21
  primaryBody:     20,  // 15 / 20
  secondaryBody:   18,  // 13 / 18
  caption:         14,  // 12 / 14
  sectionLabel:    18,  // 13 / 18
  smallLabel:      14,  // 11 / 14
  buttonText:      20,  // 15 / 20

  // Generic aliases for non-spec usage
  tight:      1.2,
  normal:     1.5,
  relaxed:    1.8,
};

// ─── Letter Spacing ──────────────────────────────────────────────────────────
// Converted from Figma % → React Native pts: (fontSize × percentage / 100)

export const LETTER_SPACING = {
  navigationTitle: -0.20,  // 28 × -0.7%
  pageTitle:       -0.11,  // 22 × -0.5%
  sectionHeader:    0.17,  // 17 × +1.0%
  primaryBody:      0,
  secondaryBody:    0,
  caption:          0,
  sectionLabel:    -0.03,  // 13 × -0.2%
  smallLabel:       0,
  buttonText:       0,

  // Generic aliases
  tight:  -0.5,
  normal:  0,
  wide:    0.5,
};

// ─── Composite Text Styles ───────────────────────────────────────────────────
// Use these pre-built objects directly in StyleSheet.create()
// e.g.  ...TEXT_STYLES.pageTitle

export const TEXT_STYLES = {
  /** 28pt / 32lh / -0.7% / Sequel Sans Semi Bold Heading */
  navigationTitle: {
    fontFamily:    FONTS.semiBoldHead,
    fontSize:      28,
    lineHeight:    32,
    letterSpacing: LETTER_SPACING.navigationTitle,
  },

  /** 22pt / 30lh / -0.5% / Sequel Sans Medium Body */
  pageTitle: {
    fontFamily:    FONTS.mediumBody,
    fontSize:      22,
    lineHeight:    30,
    letterSpacing: LETTER_SPACING.pageTitle,
  },

  /** 17pt / 21lh / +1% / Sequel Sans Medium body */
  sectionHeader: {
    fontFamily:    FONTS.mediumBody,
    fontSize:      17,
    lineHeight:    21,
    letterSpacing: LETTER_SPACING.sectionHeader,
  },

  /** 15pt / 20lh / 0% / Sequel Sans Book Body */
  primaryBody: {
    fontFamily:    FONTS.bookBody,
    fontSize:      15,
    lineHeight:    20,
    letterSpacing: LETTER_SPACING.primaryBody,
  },

  /** 13pt / 18lh / 0% / Sequel Sans Light Body */
  secondaryBody: {
    fontFamily:    FONTS.lightBody,
    fontSize:      13,
    lineHeight:    18,
    letterSpacing: LETTER_SPACING.secondaryBody,
  },

  /** 12pt / 14lh / 0% / Sequel Sans Book Body */
  caption: {
    fontFamily:    FONTS.bookBody,
    fontSize:      12,
    lineHeight:    14,
    letterSpacing: LETTER_SPACING.caption,
  },

  /** 13pt / 18lh / -0.2% / Sequel Sans Semi Bold Body */
  sectionLabel: {
    fontFamily:    FONTS.semiBoldBody,
    fontSize:      13,
    lineHeight:    18,
    letterSpacing: LETTER_SPACING.sectionLabel,
  },

  /** 11pt / 14lh / 0% / Sequel Sans Book Body */
  smallLabel: {
    fontFamily:    FONTS.bookBody,
    fontSize:      11,
    lineHeight:    14,
    letterSpacing: LETTER_SPACING.smallLabel,
  },

  /** 15pt / 20lh / 0% / Sequel Sans Medium Body */
  buttonText: {
    fontFamily:    FONTS.mediumBody,
    fontSize:      15,
    lineHeight:    20,
    letterSpacing: LETTER_SPACING.buttonText,
  },
};

// ─── Legacy font weight map (kept for backward compat) ───────────────────────
export const FONT_WEIGHT = {
  light:    '300',
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
};
