package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.ArenaMode
import com.example.ui.components.BattleOptionButton
import com.example.ui.components.PowerUpBar
import com.example.ui.theme.ArenaAmber
import com.example.ui.theme.ArenaCrimson
import com.example.ui.theme.ArenaElectricCyan
import com.example.ui.theme.ArenaGold
import com.example.ui.theme.ArenaNeonPurple
import com.example.ui.theme.ArenaNeonTeal
import com.example.ui.theme.ArenaScoreGreen
import com.example.ui.theme.ArenaVividViolet
import com.example.ui.theme.ScBackground
import com.example.ui.theme.ScBorder
import com.example.ui.theme.ScForeground
import com.example.ui.theme.ScPrimaryBlue
import com.example.ui.theme.ScSurface
import com.example.ui.theme.ScSurfaceMuted
import com.example.ui.theme.ScTextMuted
import com.example.viewmodel.BattleState

@Composable
fun ArenaVersusIntroScreen(
    battleState: BattleState,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.radialGradient(
                    colors = listOf(
                        ArenaVividViolet.copy(alpha = 0.4f),
                        MaterialTheme.colorScheme.background
                    )
                )
            )
            .testTag("versus_intro_screen"),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(24.dp)
        ) {
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = ArenaElectricCyan.copy(alpha = 0.2f),
                border = BorderStroke(1.dp, ArenaElectricCyan)
            ) {
                Text(
                    text = battleState.mode.title.uppercase(),
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = ArenaElectricCyan,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Player Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                border = BorderStroke(1.5.dp, ArenaElectricCyan)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = CircleShape,
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.3f),
                        modifier = Modifier.size(54.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(text = "🎓", fontSize = 28.sp)
                        }
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Column {
                        Text(
                            text = "You (Ukasha)",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "SmartClass Academy • UAE 🇦🇪",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Animated VS Badge
            Surface(
                shape = CircleShape,
                color = ArenaCrimson,
                modifier = Modifier.size(56.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = "VS",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Opponent Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                border = BorderStroke(
                    1.5.dp,
                    if (battleState.mode == ArenaMode.BOSS_BATTLE) ArenaCrimson else ArenaGold
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = CircleShape,
                        color = (if (battleState.mode == ArenaMode.BOSS_BATTLE) ArenaCrimson else ArenaGold).copy(alpha = 0.2f),
                        modifier = Modifier.size(54.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = if (battleState.mode == ArenaMode.BOSS_BATTLE) battleState.boss.avatarEmoji else battleState.opponentAvatarEmoji,
                                fontSize = 28.sp
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Column {
                        Text(
                            text = if (battleState.mode == ArenaMode.BOSS_BATTLE) battleState.boss.name else battleState.opponentName,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = if (battleState.mode == ArenaMode.BOSS_BATTLE) battleState.boss.title else battleState.opponentSchool,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(36.dp))

            Text(
                text = "GET READY...",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.ExtraBold,
                color = ArenaGold,
                letterSpacing = 2.sp
            )
        }
    }
}

@Composable
fun ArenaBattleScreen(
    battleState: BattleState,
    onOptionSelect: (Int) -> Unit,
    onUsePowerUp: (String) -> Unit,
    onForfeit: () -> Unit,
    modifier: Modifier = Modifier
) {
    val currentQuestion = battleState.questions.getOrNull(battleState.currentQuestionIndex)

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
            .testTag("arena_battle_screen")
    ) {
        // Top Header: Forfeit Button, Round Counter, and Mode Badge
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(
                onClick = onForfeit,
                modifier = Modifier.testTag("forfeit_battle_button")
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Exit Battle",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Surface(
                shape = RoundedCornerShape(8.dp),
                color = MaterialTheme.colorScheme.surfaceVariant
            ) {
                Text(
                    text = "Round ${battleState.currentQuestionIndex + 1} / ${battleState.questions.size}",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                )
            }

            Surface(
                shape = RoundedCornerShape(8.dp),
                color = ArenaElectricCyan.copy(alpha = 0.2f)
            ) {
                Text(
                    text = battleState.mode.badgeText,
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = ArenaElectricCyan,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Dynamic Mode HUD:
        when (battleState.mode) {
            ArenaMode.BOSS_BATTLE -> {
                BossBattleHUD(battleState = battleState)
            }
            ArenaMode.ROCKET_RACE -> {
                RocketRaceHUD(battleState = battleState)
            }
            else -> {
                QuickDuelHUD(battleState = battleState)
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Timer Bar
        val timerFraction = battleState.timeRemaining.toFloat() / battleState.maxTimePerQuestion.toFloat()
        val animatedTimer by animateFloatAsState(targetValue = timerFraction, label = "timer_anim")

        val timerColor = when {
            battleState.isTimeFrozen -> ArenaElectricCyan
            battleState.timeRemaining <= 4 -> ArenaCrimson
            battleState.timeRemaining <= 8 -> ArenaAmber
            else -> ArenaElectricCyan
        }

        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Timer,
                        contentDescription = "Timer",
                        tint = timerColor,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (battleState.isTimeFrozen) "TIME FROZEN (+10s)" else "${battleState.timeRemaining}s",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = timerColor
                    )
                }

                if (battleState.currentStreak > 1) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = ArenaAmber.copy(alpha = 0.2f)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocalFireDepartment,
                                contentDescription = "Streak",
                                tint = ArenaAmber,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(2.dp))
                            Text(
                                text = "${battleState.currentStreak}x STREAK",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.ExtraBold,
                                color = ArenaAmber
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            LinearProgressIndicator(
                progress = { animatedTimer },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = timerColor,
                trackColor = MaterialTheme.colorScheme.surfaceVariant
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Question Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .testTag("question_card"),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = ScSurface),
            border = BorderStroke(1.5.dp, ScBorder)
        ) {
            Column(
                modifier = Modifier.padding(18.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Color(0xFFEFF6FF),
                        border = BorderStroke(1.dp, Color(0xFFBFDBFE))
                    ) {
                        Text(
                            text = "${currentQuestion?.subject?.iconEmoji ?: "✨"} ${currentQuestion?.subject?.displayName ?: ""}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = ScPrimaryBlue,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }

                    Text(
                        text = currentQuestion?.curriculum?.shortCode ?: "STEM",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.SemiBold,
                        color = ScTextMuted
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = currentQuestion?.questionText ?: "Loading next arena question...",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = ScForeground,
                    lineHeight = 24.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Options
        val letters = listOf("A", "B", "C", "D")
        currentQuestion?.options?.forEachIndexed { index, optionText ->
            val isSelected = battleState.selectedOptionIndex == index
            val isCorrect = index == currentQuestion.correctIndex
            val isEliminated = battleState.eliminatedOptionIndices.contains(index)

            BattleOptionButton(
                optionText = optionText,
                optionLetter = letters.getOrElse(index) { "$index" },
                isSelected = isSelected,
                isAnswerSubmitted = battleState.isAnswerSubmitted,
                isCorrectOption = isCorrect,
                isEliminated = isEliminated,
                onOptionClick = { onOptionSelect(index) },
                modifier = Modifier.padding(vertical = 4.dp)
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Power-Up Bar
        PowerUpBar(
            powerUps = battleState.powerUps,
            isAnswerSubmitted = battleState.isAnswerSubmitted,
            onUsePowerUp = onUsePowerUp
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Opponent Live Action Ticker
        Surface(
            shape = RoundedCornerShape(10.dp),
            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "📡", fontSize = 14.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = battleState.opponentStatusTicker,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun QuickDuelHUD(battleState: BattleState) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = ScSurface),
        border = BorderStroke(1.5.dp, ScBorder)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            if (battleState.mode == ArenaMode.ROOM_CHALLENGE && battleState.roomCode.isNotBlank()) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFFEF3C7),
                    border = BorderStroke(1.dp, Color(0xFFFDE68A)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 10.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "🎮 FRIEND CHALLENGE ROOM",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFFD97706)
                        )
                        Text(
                            text = battleState.roomCode,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF92400E)
                        )
                    }
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
            // Player
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    shape = CircleShape,
                    color = Color(0xFFEFF6FF),
                    border = BorderStroke(1.dp, Color(0xFFBFDBFE)),
                    modifier = Modifier.size(40.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(text = "🎓", fontSize = 20.sp)
                    }
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "You",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = ScTextMuted
                    )
                    Text(
                        text = "${battleState.playerScore} pts",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Black,
                        color = ScPrimaryBlue
                    )
                }
            }

            Surface(
                shape = CircleShape,
                color = ScSurfaceMuted,
                border = BorderStroke(1.dp, ScBorder),
                modifier = Modifier.size(34.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = "VS",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Black,
                        color = ScTextMuted
                    )
                }
            }

            // Opponent
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = battleState.opponentName,
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = ScTextMuted
                    )
                    Text(
                        text = "${battleState.opponentScore} pts",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Black,
                        color = Color(0xFFD97706)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Surface(
                    shape = CircleShape,
                    color = Color(0xFFFEF3C7),
                    border = BorderStroke(1.dp, Color(0xFFFDE68A)),
                    modifier = Modifier.size(40.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(text = battleState.opponentAvatarEmoji, fontSize = 20.sp)
                    }
                }
            }
        }
        }
    }
}

@Composable
fun BossBattleHUD(battleState: BattleState) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = ScSurface),
        border = BorderStroke(1.5.dp, Color(0xFFFCA5A5))
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            // Boss HP Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = battleState.boss.avatarEmoji, fontSize = 20.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = battleState.boss.name,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = ArenaCrimson
                    )
                }
                Text(
                    text = "${battleState.bossHp} / ${battleState.boss.maxHp} HP",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = ArenaCrimson
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            val bossHpFraction = (battleState.bossHp.toFloat() / battleState.boss.maxHp.toFloat()).coerceIn(0f, 1f)
            val animatedBossHp by animateFloatAsState(targetValue = bossHpFraction, label = "boss_hp")

            LinearProgressIndicator(
                progress = { animatedBossHp },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(10.dp)
                    .clip(RoundedCornerShape(5.dp)),
                color = ArenaCrimson,
                trackColor = MaterialTheme.colorScheme.surface
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Player Shield Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = "Shield",
                        tint = ArenaElectricCyan,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Your Shield",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
                Text(
                    text = "${battleState.playerHp} HP",
                    style = MaterialTheme.typography.labelSmall,
                    color = ArenaElectricCyan,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            val playerHpFraction = (battleState.playerHp.toFloat() / 1000f).coerceIn(0f, 1f)
            LinearProgressIndicator(
                progress = { playerHpFraction },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = ArenaElectricCyan,
                trackColor = MaterialTheme.colorScheme.surface
            )
        }
    }
}

@Composable
fun RocketRaceHUD(battleState: BattleState) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        border = BorderStroke(1.dp, ArenaAmber.copy(alpha = 0.4f))
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "🚀 Atmospheric Ascent (Target: 100 km Orbit)",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = ArenaAmber
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Player Rocket
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "You", style = MaterialTheme.typography.labelSmall, modifier = Modifier.width(45.dp))
                LinearProgressIndicator(
                    progress = { (battleState.playerAltitudeKm / 100f).coerceIn(0f, 1f) },
                    modifier = Modifier
                        .weight(1f)
                        .height(12.dp)
                        .clip(RoundedCornerShape(6.dp)),
                    color = ArenaNeonTeal,
                    trackColor = MaterialTheme.colorScheme.surface
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "${battleState.playerAltitudeKm} km",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = ArenaNeonTeal
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Opponent Rocket
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Rival", style = MaterialTheme.typography.labelSmall, modifier = Modifier.width(45.dp))
                LinearProgressIndicator(
                    progress = { (battleState.opponentAltitudeKm / 100f).coerceIn(0f, 1f) },
                    modifier = Modifier
                        .weight(1f)
                        .height(12.dp)
                        .clip(RoundedCornerShape(6.dp)),
                    color = ArenaAmber,
                    trackColor = MaterialTheme.colorScheme.surface
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "${battleState.opponentAltitudeKm} km",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = ArenaAmber
                )
            }
        }
    }
}
