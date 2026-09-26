package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme =
  darkColorScheme(
    primary = ScPrimaryBlue,
    onPrimary = Color.White,
    primaryContainer = ScDarkSurfaceMuted,
    onPrimaryContainer = Color(0xFF93C5FD),
    secondary = ScPrimaryIndigo,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFF312E81),
    onSecondaryContainer = Color(0xFFC7D2FE),
    tertiary = ScAccentPurple,
    onTertiary = Color.White,
    background = ScDarkBackground,
    onBackground = ScDarkForeground,
    surface = ScDarkSurface,
    onSurface = ScDarkForeground,
    surfaceVariant = ScDarkSurfaceMuted,
    onSurfaceVariant = ScDarkTextMuted,
    outline = ScDarkBorder,
    error = ScDestructiveRed,
    onError = Color.White
  )

private val LightColorScheme =
  lightColorScheme(
    primary = ScPrimaryBlue,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFEFF6FF),
    onPrimaryContainer = Color(0xFF1E40AF),
    secondary = ScPrimaryIndigo,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFEEF2FF),
    onSecondaryContainer = Color(0xFF3730A3),
    tertiary = ScAccentPurple,
    onTertiary = Color.White,
    background = ScBackground,
    onBackground = ScForeground,
    surface = ScSurface,
    onSurface = ScForeground,
    surfaceVariant = ScSurfaceMuted,
    onSurfaceVariant = ScTextMuted,
    outline = ScBorder,
    error = ScDestructiveRed,
    onError = Color.White
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = isSystemInDarkTheme(),
  // Disable dynamic color so SmartClass24 exact brand colors are always preserved
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  val colorScheme =
    when {
      dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
        val context = LocalContext.current
        if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
      }

      darkTheme -> DarkColorScheme
      else -> LightColorScheme
    }

  MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
}

