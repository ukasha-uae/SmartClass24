package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Leaderboard
import androidx.compose.material.icons.filled.Replay
import androidx.compose.material.icons.filled.School
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.ArenaMode
import com.example.ui.theme.ArenaAmber
import com.example.ui.theme.ArenaCrimson
import com.example.ui.theme.ArenaElectricCyan
import com.example.ui.theme.ArenaGold
import com.example.ui.theme.ArenaNeonPurple
import com.example.ui.theme.ArenaNeonTeal
import com.example.ui.theme.ArenaScoreGreen
import com.example.ui.theme.ScBackground
import com.example.ui.theme.ScBorder
import com.example.ui.theme.ScForeground
import com.example.ui.theme.ScPrimaryBlue
import com.example.ui.theme.ScSurface
import com.example.ui.theme.ScSurfaceMuted
import com.example.ui.theme.ScTextMuted
import com.example.ui.theme.ScSuccessGreen
import com.example.ui.theme.ScDestructiveRed
import com.example.viewmodel.BattleState
import com.example.viewmodel.QuestionReview

@Composable
fun ArenaResultScreen(
    battleState: BattleState,
    onRematch: () -> Unit,
    onBackToLobby: () -> Unit,
    onViewLeaderboard: () -> Unit,
    onOpenShop: (() -> Unit)? = null,
    onOpenAchievements: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val isVictory = when (battleState.mode) {
        ArenaMode.BOSS_BATTLE -> battleState.bossHp <= 0 || battleState.playerScore >= battleState.opponentScore
        ArenaMode.ROCKET_RACE -> battleState.playerAltitudeKm >= battleState.opponentAltitudeKm
        else -> battleState.playerScore >= battleState.opponentScore
    }

    val correctAnswersCount = battleState.reviews.count { it.isCorrect }
    val totalQuestions = battleState.questions.size
    val accuracyPercent = if (totalQuestions > 0) (correctAnswersCount * 100) / totalQuestions else 0
    val xpEarned = battleState.playerScore / 2

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(ScBackground)
            .padding(16.dp)
            .testTag("arena_result_screen"),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(8.dp))
            // Victory / Defeat Hero Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("victory_banner_card"),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = ScSurface),
                border = BorderStroke(
                    1.5.dp,
                    if (isVictory) Color(0xFFFDE68A) else Color(0xFFFECACA)
                )
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Surface(
                        shape = CircleShape,
                        color = if (isVictory) Color(0xFFFEF3C7) else Color(0xFFFEE2E2),
                        border = BorderStroke(1.dp, if (isVictory) Color(0xFFFDE68A) else Color(0xFFFCA5A5)),
                        modifier = Modifier.size(72.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = if (isVictory) "🏆" else "⚡",
                                fontSize = 36.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = if (isVictory) "VICTORY!" else "VALIANT EFFORT!",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Black,
                        color = if (isVictory) Color(0xFFD97706) else ScForeground
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = if (isVictory) "You conquered the ${battleState.mode.title} Arena!"
                        else "Learn from the AI review below and bounce back stronger.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = ScTextMuted
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    // Trophy Delta Badge
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = if (battleState.trophyDelta >= 0) Color(0xFFFEF3C7) else Color(0xFFFEE2E2),
                        border = BorderStroke(1.dp, if (battleState.trophyDelta >= 0) Color(0xFFFDE68A) else Color(0xFFFCA5A5))
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = if (battleState.trophyDelta >= 0) "+${battleState.trophyDelta} 🏆 TROPHIES"
                                else "${battleState.trophyDelta} 🏆 TROPHIES",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = if (battleState.trophyDelta >= 0) Color(0xFFD97706) else ScDestructiveRed
                            )
                        }
                    }
                }
            }
        }

        // Stats Matrix
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                StatResultCard(
                    title = "Score",
                    value = "${battleState.playerScore}",
                    subtitle = "pts",
                    color = ScPrimaryBlue,
                    modifier = Modifier.weight(1f)
                )
                StatResultCard(
                    title = "Accuracy",
                    value = "$accuracyPercent%",
                    subtitle = "$correctAnswersCount of $totalQuestions",
                    color = ScSuccessGreen,
                    modifier = Modifier.weight(1f)
                )
                StatResultCard(
                    title = "Max Streak",
                    value = "${battleState.highestMatchStreak}x",
                    subtitle = "combo",
                    color = Color(0xFFD97706),
                    modifier = Modifier.weight(1f)
                )
                StatResultCard(
                    title = "XP Gained",
                    value = "+$xpEarned",
                    subtitle = "exp",
                    color = Color(0xFF9333EA),
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Action Buttons
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = onRematch,
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp)
                        .testTag("rematch_button"),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = ScPrimaryBlue,
                        contentColor = Color.White
                    )
                ) {
                    Icon(imageVector = Icons.Default.Replay, contentDescription = "Rematch")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Rematch", fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = onBackToLobby,
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp)
                        .testTag("lobby_button"),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = ScForeground
                    ),
                    border = BorderStroke(1.5.dp, ScBorder)
                ) {
                    Icon(imageVector = Icons.Default.Home, contentDescription = "Lobby")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Arena Lobby", fontWeight = FontWeight.Bold)
                }
            }
        }

        if (onOpenShop != null || onOpenAchievements != null) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    if (onOpenShop != null) {
                        OutlinedButton(
                            onClick = onOpenShop,
                            modifier = Modifier
                                .weight(1f)
                                .height(44.dp)
                                .testTag("result_open_shop_btn"),
                            shape = RoundedCornerShape(12.dp),
                            border = BorderStroke(1.dp, Color(0xFFFDE68A)),
                            colors = ButtonDefaults.outlinedButtonColors(containerColor = Color(0xFFFEF3C7))
                        ) {
                            Text("🛍️ Armory Shop", fontWeight = FontWeight.Bold, color = Color(0xFF92400E))
                        }
                    }
                    if (onOpenAchievements != null) {
                        OutlinedButton(
                            onClick = onOpenAchievements,
                            modifier = Modifier
                                .weight(1f)
                                .height(44.dp)
                                .testTag("result_open_achievements_btn"),
                            shape = RoundedCornerShape(12.dp),
                            border = BorderStroke(1.dp, Color(0xFFBFDBFE)),
                            colors = ButtonDefaults.outlinedButtonColors(containerColor = Color(0xFFEFF6FF))
                        ) {
                            Text("🏆 Trophy Hall", fontWeight = FontWeight.Bold, color = ScPrimaryBlue)
                        }
                    }
                }
            }
        }

        // Smart AI Pedagogical Breakdown Section Header
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = CircleShape,
                    color = ArenaElectricCyan.copy(alpha = 0.2f),
                    modifier = Modifier.size(32.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(text = "🤖", fontSize = 16.sp)
                    }
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "SmartClass AI Tutor Breakdown",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Review step-by-step explanations and key formulas",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        // Question Review Items
        itemsIndexed(battleState.reviews) { index, review ->
            QuestionReviewCard(index = index + 1, review = review)
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun StatResultCard(
    title: String,
    value: String,
    subtitle: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = ScSurface),
        border = BorderStroke(1.5.dp, ScBorder)
    ) {
        Column(
            modifier = Modifier.padding(vertical = 12.dp, horizontal = 6.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall,
                color = ScTextMuted,
                fontSize = 10.sp
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Black,
                color = color
            )
            Text(
                text = subtitle,
                style = MaterialTheme.typography.labelSmall,
                color = ScTextMuted,
                fontSize = 9.sp
            )
        }
    }
}

@Composable
fun QuestionReviewCard(
    index: Int,
    review: QuestionReview,
    modifier: Modifier = Modifier
) {
    val q = review.question
    val selectedText = review.selectedIndex?.let { q.options.getOrNull(it) } ?: "Timed Out"
    val correctText = q.options.getOrNull(q.correctIndex) ?: ""

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = ScSurface),
        border = BorderStroke(
            1.5.dp,
            if (review.isCorrect) Color(0xFFBBF7D0) else Color(0xFFFECACA)
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header: Question #, Subject, Result icon
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = ScSurfaceMuted,
                        border = BorderStroke(1.dp, ScBorder)
                    ) {
                        Text(
                            text = "Q$index",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "${q.subject.iconEmoji} ${q.subject.displayName}",
                        style = MaterialTheme.typography.labelSmall,
                        color = ScTextMuted
                    )
                }

                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = if (review.isCorrect) Color(0xFFDCFCE7) else Color(0xFFFEE2E2),
                    border = BorderStroke(1.dp, if (review.isCorrect) Color(0xFF86EFAC) else Color(0xFFFCA5A5))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = if (review.isCorrect) Icons.Default.CheckCircle else Icons.Default.Close,
                            contentDescription = if (review.isCorrect) "Correct" else "Incorrect",
                            tint = if (review.isCorrect) ScSuccessGreen else ScDestructiveRed,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (review.isCorrect) "CORRECT" else "MISSED",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = if (review.isCorrect) ScSuccessGreen else ScDestructiveRed
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = q.questionText,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = ScForeground
            )

            Spacer(modifier = Modifier.height(10.dp))

            // User Answer vs Correct Answer
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(ScSurfaceMuted, RoundedCornerShape(10.dp))
                    .padding(10.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                if (!review.isCorrect) {
                    Text(
                        text = "Your Answer: $selectedText",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.SemiBold,
                        color = ScDestructiveRed
                    )
                }
                Text(
                    text = "Correct Answer: $correctText",
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.Bold,
                    color = ScSuccessGreen
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Pedagogical AI Explanation
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFEFF6FF), RoundedCornerShape(10.dp))
                    .border(1.dp, Color(0xFFBFDBFE), RoundedCornerShape(10.dp))
                    .padding(10.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "💡 Concept: ", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = ScPrimaryBlue)
                    Text(text = q.keyConcept, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.SemiBold, color = ScForeground)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = q.explanation,
                    style = MaterialTheme.typography.bodySmall,
                    color = ScTextMuted,
                    lineHeight = 18.sp
                )
            }
        }
    }
}
