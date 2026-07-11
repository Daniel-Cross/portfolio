// Original Fact Machine dark-theme colours, copied from
// factmachine-monorepo apps/mobile/constants/colors.ts so the lab ports
// render with the app's real palette instead of this site's accent.
export const fm = {
  // theme.accentPrimary (palette.warm450)
  accent: "rgba(255, 154, 2, 1)",
  // theme.badgeOrangeText (palette.warm300)
  pillText: "rgba(255, 191, 88, 1)",
  // palette.pillGlowWarmDark, the orange AnimatedGradientPill sweep stops
  pillGlow: [
    "rgba(255, 220, 136, 0.9)",
    "rgba(254, 172, 39, 1)",
    "rgba(254, 146, 39, 0.9)",
    "rgba(222, 101, 26, 1)",
  ],
  // theme.textTertiary (palette.white40), the shimmer base
  shimmerBase: "rgba(255, 255, 255, 0.4)",
  shimmerHighlight: "rgba(255, 255, 255, 0.92)",
} as const
