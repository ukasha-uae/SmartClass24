package com.example.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// SmartClass24 Exact Brand Palette (matching globals.css & tailwind.config.ts)
val ScBackground = Color(0xFFF8FAFC)        // Slate-50 background (light mode)
val ScSurface = Color(0xFFFFFFFF)           // Crisp white card surface
val ScSurfaceMuted = Color(0xFFF1F5F9)      // Slate-100 muted container
val ScBorder = Color(0xFFE2E8F0)            // Slate-200 border
val ScBorderSubtle = Color(0xFFF1F5F9)      // Slate-100 border
val ScForeground = Color(0xFF0F172A)        // Slate-900 dark text
val ScTextMuted = Color(0xFF64748B)         // Slate-500 muted text
val ScTextSubtle = Color(0xFF94A3B8)        // Slate-400 subtle text

// SmartClass24 Dark Mode Palette (222 47% 11% / 222 47% 14%)
val ScDarkBackground = Color(0xFF0F172A)    // Slate-900 dark background
val ScDarkSurface = Color(0xFF1E293B)       // Slate-800 dark card surface
val ScDarkSurfaceMuted = Color(0xFF141C2E)  // Dark muted
val ScDarkBorder = Color(0xFF334155)        // Slate-700 dark border
val ScDarkForeground = Color(0xFFF8FAFC)    // White text
val ScDarkTextMuted = Color(0xFF94A3B8)     // Slate-400 dark muted text

// Core Brand Primary Gradients (Blue-600 to Indigo-600)
val ScPrimaryBlue = Color(0xFF2563EB)       // Blue 600
val ScPrimaryIndigo = Color(0xFF4F46E5)     // Indigo 600
val ScAccentViolet = Color(0xFF7C3AED)      // Violet 600
val ScAccentPurple = Color(0xFF9333EA)      // Purple 600

// Exact Challenge Arena Metric Card Gradients & Colors
// 1. Rating (Blue to Purple)
val ScMetricRatingBg = Color(0xFFEFF6FF)
val ScMetricRatingBorder = Color(0xFFBFDBFE)
val ScMetricRatingStart = Color(0xFF2563EB)
val ScMetricRatingEnd = Color(0xFF9333EA)

// 2. Wins (Amber to Orange)
val ScMetricWinsBg = Color(0xFFFFFBEB)
val ScMetricWinsBorder = Color(0xFFFDE68A)
val ScMetricWinsStart = Color(0xFFD97706)
val ScMetricWinsEnd = Color(0xFFEA580C)

// 3. Win Streak (Emerald to Teal)
val ScMetricStreakBg = Color(0xFFECFDF5)
val ScMetricStreakBorder = Color(0xFFA7F3D0)
val ScMetricStreakStart = Color(0xFF059669)
val ScMetricStreakEnd = Color(0xFF0D9488)

// 4. Total Games (Purple to Pink)
val ScMetricGamesBg = Color(0xFFFAF5FF)
val ScMetricGamesBorder = Color(0xFFE9D5FF)
val ScMetricGamesStart = Color(0xFF9333EA)
val ScMetricGamesEnd = Color(0xFFDB2777)

// 5. Coins (Yellow to Amber)
val ScMetricCoinsBg = Color(0xFFFEFCE8)
val ScMetricCoinsBorder = Color(0xFFFEF08A)
val ScMetricCoinsStart = Color(0xFFCA8A04)
val ScMetricCoinsEnd = Color(0xFFD97706)

// Exact Challenge Arena Game Mode Card Gradients
// Practice Mode: Green-500 to Emerald-600
val ScPracticeStart = Color(0xFF22C55E)
val ScPracticeEnd = Color(0xFF059669)

// Quick Match: Orange-500 to Red-600
val ScQuickMatchStart = Color(0xFFF97316)
val ScQuickMatchEnd = Color(0xFFDC2626)

// Challenge Friend: Purple-500 to Indigo-600
val ScChallengeFriendStart = Color(0xFFA855F7)
val ScChallengeFriendEnd = Color(0xFF4F46E5)

// Boss Battle: Red-500 to Orange-600
val ScBossBattleStart = Color(0xFFEF4444)
val ScBossBattleEnd = Color(0xFFEA580C)

// School Battle: Purple-500 to Pink-600
val ScSchoolBattleStart = Color(0xFFA855F7)
val ScSchoolBattleEnd = Color(0xFFDB2777)

// Tournaments: Amber-500 to Orange-600
val ScTournamentStart = Color(0xFFF59E0B)
val ScTournamentEnd = Color(0xFFEA580C)

// Large Screen Arena: Violet-600 -> Indigo-700 -> Amber-500
val ScLargeScreenStart = Color(0xFF7C3AED)
val ScLargeScreenMid = Color(0xFF4338CA)
val ScLargeScreenEnd = Color(0xFFF59E0B)

// Status & Feedback Colors
val ScSuccessGreen = Color(0xFF16A34A)
val ScDestructiveRed = Color(0xFFDC2626)
val ScWarningAmber = Color(0xFFD97706)

// Gradient Brushes
val ScBrandTitleGradient = Brush.linearGradient(listOf(ScPrimaryBlue, ScPrimaryIndigo))
val ScWelcomeGradientLight = Brush.linearGradient(listOf(Color(0xFFEFF6FF), Color(0xFFFAF5FF)))
val ScWelcomeGradientDark = Brush.linearGradient(listOf(Color(0xFF172554), Color(0xFF2E1065)))
val ScAmberPillGradient = Brush.linearGradient(listOf(Color(0x1AF59E0B), Color(0x1AEA580C)))

// Aliases for compatibility with existing imports
val ArenaMidnight = ScDarkBackground
val ArenaSurfaceDark = ScDarkSurface
val ArenaCardDark = ScDarkSurfaceMuted
val ArenaCardHighlight = Color(0xFF27354E)
val ArenaElectricCyan = Color(0xFF38BDF8)
val ArenaNeonTeal = Color(0xFF10B981)
val ArenaVividViolet = ScPrimaryIndigo
val ArenaNeonPurple = ScAccentPurple
val ArenaGold = ScMetricWinsStart
val ArenaAmber = ScMetricWinsEnd
val ArenaCrimson = ScDestructiveRed
val ArenaScoreGreen = ScSuccessGreen
val ArenaLightBg = ScBackground
val ArenaLightSurface = ScSurface
val ArenaLightCard = ScSurfaceMuted
val ArenaIndigoPrimary = ScPrimaryBlue
val ArenaTealPrimary = Color(0xFF0284C7)


