package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Leaderboard
import androidx.compose.material.icons.filled.MilitaryTech
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.ArenaMode
import com.example.model.Curriculum
import com.example.model.Subject
import com.example.ui.components.ArenaHubQuickActionBar
import com.example.ui.components.ArenaModeCard
import com.example.ui.components.ArenaPlayerHeader
import com.example.ui.components.ChallengeArenaTitleSection
import com.example.ui.components.CurriculumSelectorRow
import com.example.ui.components.SmartClassAuthDialog
import com.example.ui.components.StatMetricGrid
import com.example.ui.components.SubjectSelectorRow
import com.example.ui.components.TopPlayersPreviewCard
import com.example.ui.components.WelcomeRegionalCard
import com.example.ui.theme.ScBackground
import com.example.ui.theme.ScBorder
import com.example.ui.theme.ScDestructiveRed
import com.example.ui.theme.ScForeground
import com.example.ui.theme.ScPrimaryBlue
import com.example.ui.theme.ScPrimaryIndigo
import com.example.ui.theme.ScSuccessGreen
import com.example.ui.theme.ScSurface
import com.example.ui.theme.ScTextMuted
import com.example.viewmodel.ArenaScreen
import com.example.viewmodel.ArenaUiState

@Composable
fun ArenaLobbyScreen(
    state: ArenaUiState,
    onCurriculumChange: (Curriculum) -> Unit,
    onSubjectChange: (Subject) -> Unit,
    onModeSelect: (ArenaMode) -> Unit,
    onNavigate: (ArenaScreen) -> Unit,
    onRoomCodeChange: (String) -> Unit,
    onOpenAuthDialog: () -> Unit = {},
    onCloseAuthDialog: () -> Unit = {},
    onSignIn: (String, String) -> Unit = { _, _ -> },
    onRegister: (String, String, String, String, String, String) -> Unit = { _, _, _, _, _, _ -> },
    onGuestSignIn: () -> Unit = {},
    onSignOut: () -> Unit = {},
    onUpdateProfile: (String, String, String, String) -> Unit = { _, _, _, _ -> },
    onClearAuthMessages: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(ScBackground)
                .padding(horizontal = 16.dp)
                .testTag("arena_lobby_screen"),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Challenge Arena Title & Header
            item {
                Spacer(modifier = Modifier.height(12.dp))
                ChallengeArenaTitleSection()
            }

            // 2. Player Profile HUD
            item {
                ArenaPlayerHeader(
                    profile = state.userProfile,
                    onLeaderboardClick = { onNavigate(ArenaScreen.LEADERBOARD) },
                    onProfileClick = onOpenAuthDialog
                )
            }

        // 3. 5 Exact Metric Stat Cards (Rating, Wins, Streak, Total Games, Coins)
        item {
            StatMetricGrid(
                profile = state.userProfile,
                onCoinsClick = { onNavigate(ArenaScreen.SHOP) }
            )
        }

        // Quick Hub Navigation: Armory Shop & Trophy Hall Quests
        item {
            ArenaHubQuickActionBar(
                onShopClick = { onNavigate(ArenaScreen.SHOP) },
                onAchievementsClick = { onNavigate(ArenaScreen.ACHIEVEMENTS) }
            )
        }

        // 4. Welcome to Regional Challenges Card (exact web replica)
        item {
            WelcomeRegionalCard()
        }

        // 5. Top Players Preview Card
        item {
            TopPlayersPreviewCard(
                topUsers = state.leaderboards,
                onViewAllClick = { onNavigate(ArenaScreen.LEADERBOARD) }
            )
        }

        // 6. Regional / Country Curriculum Filter Row
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Curriculum / Country",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = ScForeground
                    )
                    Text(
                        text = "${state.selectedCurriculum.flag} ${state.selectedCurriculum.displayName}",
                        style = MaterialTheme.typography.bodySmall,
                        color = ScPrimaryBlue,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                CurriculumSelectorRow(
                    selectedCurriculum = state.selectedCurriculum,
                    onCurriculumSelected = onCurriculumChange
                )
            }
        }

        // 7. Battle Subject Filter Row
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Battle Subject",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = ScForeground
                )

                SubjectSelectorRow(
                    selectedSubject = state.selectedSubject,
                    onSubjectSelected = onSubjectChange
                )
            }
        }

        // 8. Arena Challenges Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Arena Challenges",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Black,
                    color = ScForeground
                )
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = Color(0xFFEFF6FF),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFBFDBFE))
                ) {
                    Text(
                        text = "7 MODES",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = ScPrimaryBlue,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
            }
        }

        // Practice Mode (Solo Sprint)
        item {
            ArenaModeCard(
                mode = ArenaMode.SOLO_SPRINT,
                onPlayClick = { onModeSelect(ArenaMode.SOLO_SPRINT) }
            )
        }

        // Quick Match (1v1 Quick Duel)
        item {
            ArenaModeCard(
                mode = ArenaMode.QUICK_DUEL,
                onPlayClick = { onModeSelect(ArenaMode.QUICK_DUEL) }
            )
        }

        // Challenge Friend (Room Challenge)
        item {
            ArenaModeCard(
                mode = ArenaMode.ROOM_CHALLENGE,
                onPlayClick = { onNavigate(ArenaScreen.ROOM_SETUP) }
            )
        }

        // School Battle (Inter-School Championship)
        item {
            ArenaModeCard(
                mode = ArenaMode.SCHOOL_BATTLE,
                onPlayClick = { onNavigate(ArenaScreen.SCHOOL_BATTLE) }
            )
        }

        // Tournaments (Single Elimination Bracket)
        item {
            ArenaModeCard(
                mode = ArenaMode.TOURNAMENTS,
                onPlayClick = { onNavigate(ArenaScreen.TOURNAMENTS) }
            )
        }

        // Boss Battle
        item {
            ArenaModeCard(
                mode = ArenaMode.BOSS_BATTLE,
                onPlayClick = { onModeSelect(ArenaMode.BOSS_BATTLE) }
            )
        }

        // Rocket Race / Large Screen Arena
        item {
            ArenaModeCard(
                mode = ArenaMode.ROCKET_RACE,
                onPlayClick = { onModeSelect(ArenaMode.ROCKET_RACE) }
            )
        }

        // Recent Matches Section
        if (state.recentMatches.isNotEmpty()) {
            item {
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Recent Battles",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = ScForeground
                    )
                    Text(
                        text = "${state.recentMatches.size} logged",
                        style = MaterialTheme.typography.bodySmall,
                        color = ScTextMuted
                    )
                }
            }

            items(state.recentMatches.take(3)) { match ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = ScSurface),
                    border = androidx.compose.foundation.BorderStroke(1.dp, ScBorder)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = CircleShape,
                                color = if (match.result == "VICTORY") Color(0xFFDCFCE7) else Color(0xFFFEE2E2),
                                modifier = Modifier.size(36.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = if (match.result == "VICTORY") "👑" else "⚡",
                                        fontSize = 18.sp
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = match.mode,
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = ScForeground
                                )
                                Text(
                                    text = "vs ${match.opponentName} • ${match.subject}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = ScTextMuted
                                )
                            }
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = if (match.trophyDelta >= 0) "+${match.trophyDelta} 🏆" else "${match.trophyDelta} 🏆",
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.Bold,
                                color = if (match.trophyDelta >= 0) Color(0xFFD97706) else ScDestructiveRed
                            )
                            Text(
                                text = "${match.accuracyPercent}% Acc",
                                style = MaterialTheme.typography.bodySmall,
                                color = ScTextMuted
                            )
                        }
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(28.dp))
        }
    }

    if (state.isAuthDialogOpen) {
        SmartClassAuthDialog(
            state = state,
            onDismiss = onCloseAuthDialog,
            onSignIn = onSignIn,
            onRegister = onRegister,
            onGuestSignIn = onGuestSignIn,
            onSignOut = onSignOut,
            onUpdateProfile = onUpdateProfile,
            onClearMessages = onClearAuthMessages
        )
    }
}
}

