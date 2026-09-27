package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.MilitaryTech
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.UserProfileEntity
import com.example.model.ArenaMode
import com.example.model.Curriculum
import com.example.model.LeaderboardUser
import com.example.model.PowerUp
import com.example.model.Subject
import com.example.ui.theme.ScAccentPurple
import com.example.ui.theme.ScAmberPillGradient
import com.example.ui.theme.ScBackground
import com.example.ui.theme.ScBorder
import com.example.ui.theme.ScBossBattleEnd
import com.example.ui.theme.ScBossBattleStart
import com.example.ui.theme.ScChallengeFriendEnd
import com.example.ui.theme.ScChallengeFriendStart
import com.example.ui.theme.ScDestructiveRed
import com.example.ui.theme.ScForeground
import com.example.ui.theme.ScLargeScreenEnd
import com.example.ui.theme.ScLargeScreenMid
import com.example.ui.theme.ScLargeScreenStart
import com.example.ui.theme.ScMetricCoinsBg
import com.example.ui.theme.ScMetricCoinsBorder
import com.example.ui.theme.ScMetricCoinsEnd
import com.example.ui.theme.ScMetricCoinsStart
import com.example.ui.theme.ScMetricGamesBg
import com.example.ui.theme.ScMetricGamesBorder
import com.example.ui.theme.ScMetricGamesEnd
import com.example.ui.theme.ScMetricGamesStart
import com.example.ui.theme.ScMetricRatingBg
import com.example.ui.theme.ScMetricRatingBorder
import com.example.ui.theme.ScMetricRatingEnd
import com.example.ui.theme.ScMetricRatingStart
import com.example.ui.theme.ScMetricStreakBg
import com.example.ui.theme.ScMetricStreakBorder
import com.example.ui.theme.ScMetricStreakEnd
import com.example.ui.theme.ScMetricStreakStart
import com.example.ui.theme.ScMetricWinsBg
import com.example.ui.theme.ScMetricWinsBorder
import com.example.ui.theme.ScMetricWinsEnd
import com.example.ui.theme.ScMetricWinsStart
import com.example.ui.theme.ScPracticeEnd
import com.example.ui.theme.ScPracticeStart
import com.example.ui.theme.ScPrimaryBlue
import com.example.ui.theme.ScPrimaryIndigo
import com.example.ui.theme.ScQuickMatchEnd
import com.example.ui.theme.ScQuickMatchStart
import com.example.ui.theme.ScSchoolBattleEnd
import com.example.ui.theme.ScSchoolBattleStart
import com.example.ui.theme.ScSuccessGreen
import com.example.ui.theme.ScSurface
import com.example.ui.theme.ScSurfaceMuted
import com.example.ui.theme.ScTextMuted
import com.example.ui.theme.ScTournamentEnd
import com.example.ui.theme.ScTournamentStart
import com.example.ui.theme.ScWelcomeGradientLight

// Challenge Arena Header Tag (matches web amber pill)
@Composable
fun ChallengeArenaHeaderTag(modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier.testTag("challenge_arena_tag"),
        shape = RoundedCornerShape(50),
        color = Color(0xFFFEF3C7).copy(alpha = 0.6f),
        border = BorderStroke(1.dp, Color(0xFFFDE68A))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "🏆", fontSize = 14.sp)
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Challenge Arena",
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFB45309)
            )
        }
    }
}

// Challenge Arena Title and Subtitle (clean, engaging student header)
@Composable
fun ChallengeArenaTitleSection(
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        ChallengeArenaHeaderTag()
        Spacer(modifier = Modifier.height(10.dp))
        Text(
            text = "🎮 Challenge Arena",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Black,
            color = ScPrimaryBlue,
            letterSpacing = (-0.5).sp
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = "Compete with classmates and schools across your region",
            style = MaterialTheme.typography.bodyMedium,
            color = ScTextMuted
        )
        Spacer(modifier = Modifier.height(10.dp))
        // Subtle amber accent divider line
        Box(
            modifier = Modifier
                .width(120.dp)
                .height(2.dp)
                .background(
                    Brush.horizontalGradient(
                        listOf(Color.Transparent, Color(0xFFFBBF24), Color.Transparent)
                    )
                )
        )
    }
}

// Exact Welcome to Regional Challenges Card from SmartClass24
@Composable
fun WelcomeRegionalCard(modifier: Modifier = Modifier) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("welcome_regional_card"),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFEFF6FF).copy(alpha = 0.8f)),
        border = BorderStroke(1.5.dp, Color(0xFFBFDBFE))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.Top
        ) {
            Surface(
                shape = CircleShape,
                color = ScPrimaryBlue,
                modifier = Modifier.size(44.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.Group,
                        contentDescription = "Users",
                        tint = Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Welcome to Regional Challenges!",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = ScForeground
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "You're now part of a broader learning community. Challenge students from other schools and regions.",
                    style = MaterialTheme.typography.bodySmall,
                    color = ScTextMuted,
                    lineHeight = 18.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Lightbulb,
                        contentDescription = "Tip",
                        tint = Color(0xFFD97706),
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Tip: Use country selector to see different school rankings!",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFFB45309)
                    )
                }
            }
        }
    }
}

// 5 Exact Player Metric Stat Cards from SmartClass24
@Composable
fun StatMetricGrid(
    profile: UserProfileEntity,
    modifier: Modifier = Modifier,
    onCoinsClick: (() -> Unit)? = null
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Row 1: Rating, Wins, Win Streak
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            SingleMetricCard(
                icon = "⭐",
                label = "Rating",
                value = "${profile.trophies}",
                bgColor = ScMetricRatingBg,
                borderColor = ScMetricRatingBorder,
                textColor = ScMetricRatingStart,
                modifier = Modifier.weight(1f),
                testTag = "metric_rating"
            )
            SingleMetricCard(
                icon = "🏆",
                label = "Wins",
                value = "${profile.victories}",
                bgColor = ScMetricWinsBg,
                borderColor = ScMetricWinsBorder,
                textColor = ScMetricWinsStart,
                modifier = Modifier.weight(1f),
                testTag = "metric_wins"
            )
            SingleMetricCard(
                icon = "🔥",
                label = "Win Streak",
                value = "${profile.currentStreak}",
                bgColor = ScMetricStreakBg,
                borderColor = ScMetricStreakBorder,
                textColor = ScMetricStreakStart,
                modifier = Modifier.weight(1f),
                testTag = "metric_streak"
            )
        }

        // Row 2: Total Games, Coins (with Buy button)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            SingleMetricCard(
                icon = "🎯",
                label = "Total Games",
                value = "${profile.totalMatches}",
                bgColor = ScMetricGamesBg,
                borderColor = ScMetricGamesBorder,
                textColor = ScMetricGamesStart,
                modifier = Modifier.weight(1f),
                testTag = "metric_games"
            )
            SingleMetricCard(
                icon = "💰",
                label = "Coins",
                value = "${profile.coins}",
                bgColor = ScMetricCoinsBg,
                borderColor = ScMetricCoinsBorder,
                textColor = ScMetricCoinsStart,
                modifier = Modifier.weight(1f),
                hasActionButton = true,
                onClick = onCoinsClick,
                testTag = "metric_coins"
            )
        }
    }
}

@Composable
fun SingleMetricCard(
    icon: String,
    label: String,
    value: String,
    bgColor: Color,
    borderColor: Color,
    textColor: Color,
    modifier: Modifier = Modifier,
    hasActionButton: Boolean = false,
    onClick: (() -> Unit)? = null,
    testTag: String = ""
) {
    Card(
        modifier = modifier
            .testTag(testTag)
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = bgColor),
        border = BorderStroke(1.dp, borderColor)
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 10.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = icon, fontSize = 16.sp)
                if (hasActionButton) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Color(0xFFFEF08A),
                        border = BorderStroke(0.5.dp, Color(0xFFCA8A04))
                    ) {
                        Text(
                            text = "Buy",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF854D0E),
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.ExtraBold,
                color = textColor
            )
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = ScTextMuted,
                fontSize = 11.sp
            )
        }
    }
}

// Arena Quick Hub Action Bar for Armory Shop and Trophy Hall Quests
@Composable
fun ArenaHubQuickActionBar(
    onShopClick: () -> Unit,
    onAchievementsClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Card(
            modifier = Modifier
                .weight(1f)
                .clickable { onShopClick() }
                .testTag("hub_btn_shop"),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7)),
            border = BorderStroke(1.dp, Color(0xFFFDE68A))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(text = "🛍️", fontSize = 18.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "Armory & Shop",
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF92400E)
                    )
                    Text(
                        text = "Boosters & Titles",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color(0xFFB45309),
                        fontSize = 10.sp
                    )
                }
            }
        }

        Card(
            modifier = Modifier
                .weight(1f)
                .clickable { onAchievementsClick() }
                .testTag("hub_btn_achievements"),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFEFF6FF)),
            border = BorderStroke(1.dp, Color(0xFFBFDBFE))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(text = "🏆", fontSize = 18.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "Trophy Hall",
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        color = ScPrimaryBlue
                    )
                    Text(
                        text = "Quests & Mastery",
                        style = MaterialTheme.typography.labelSmall,
                        color = ScPrimaryIndigo,
                        fontSize = 10.sp
                    )
                }
            }
        }
    }
}

// Exact Player Header Profile Card
@Composable
fun ArenaPlayerHeader(
    profile: UserProfileEntity,
    modifier: Modifier = Modifier,
    onLeaderboardClick: () -> Unit,
    onProfileClick: () -> Unit = {}
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("player_header_card")
            .clickable { onProfileClick() },
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFEFF6FF).copy(alpha = 0.6f)),
        border = BorderStroke(1.5.dp, Color(0xFFBFDBFE))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Avatar with ring
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier.size(54.dp)
            ) {
                Surface(
                    shape = CircleShape,
                    color = Color.White,
                    border = BorderStroke(2.5.dp, ScPrimaryBlue),
                    modifier = Modifier.size(50.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(text = profile.avatarEmoji.ifBlank { "👨‍🎓" }, fontSize = 24.sp)
                    }
                }
                // Level badge
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = Color(0xFFF59E0B),
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(end = 2.dp)
                ) {
                    Text(
                        text = "L${profile.level}",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = profile.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = ScPrimaryBlue,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    val flag = when {
                        profile.selectedRegion.contains("UAE", ignoreCase = true) -> "🇦🇪"
                        profile.selectedRegion.contains("Ghana", ignoreCase = true) || profile.selectedRegion.contains("Accra", ignoreCase = true) || profile.selectedRegion.contains("Ashanti", ignoreCase = true) -> "🇬🇭"
                        profile.selectedRegion.contains("Nigeria", ignoreCase = true) || profile.selectedRegion.contains("Lagos", ignoreCase = true) -> "🇳🇬"
                        else -> "🌍"
                    }
                    Text(text = flag, fontSize = 14.sp)
                }
                Text(
                    text = profile.school,
                    style = MaterialTheme.typography.bodySmall,
                    color = ScTextMuted,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(2.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = Color(0xFFDBEAFE)
                    ) {
                        Text(
                            text = profile.gradeLevel.ifBlank { "SHS 1" },
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = ScPrimaryBlue,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 1.dp)
                        )
                    }
                    Text(
                        text = "${profile.xp} XP",
                        fontSize = 11.sp,
                        color = ScPrimaryBlue,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            // Leaderboard Rank Pill Button
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = Color(0xFFFEF3C7),
                border = BorderStroke(1.dp, Color(0xFFFDE68A)),
                modifier = Modifier
                    .clickable { onLeaderboardClick() }
                    .testTag("leaderboard_pill_button")
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.MilitaryTech,
                        contentDescription = "Rank",
                        tint = Color(0xFFD97706),
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "#5",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFB45309)
                    )
                }
            }
        }
    }
}

// Exact Top Players Preview Card from SmartClass24
@Composable
fun TopPlayersPreviewCard(
    topUsers: List<LeaderboardUser>,
    onViewAllClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("top_players_preview_card"),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFFFFBEB).copy(alpha = 0.8f)),
        border = BorderStroke(1.5.dp, Color(0xFFFDE68A))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = CircleShape,
                        color = Color(0xFFFDE68A),
                        modifier = Modifier.size(32.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(text = "🏆", fontSize = 16.sp)
                        }
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "Top Players",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFB45309)
                        )
                        Text(
                            text = "See where you rank among the best",
                            style = MaterialTheme.typography.labelSmall,
                            color = Color(0xFF92400E)
                        )
                    }
                }

                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color.White,
                    border = BorderStroke(1.dp, Color(0xFFFDE68A)),
                    modifier = Modifier.clickable { onViewAllClick() }
                ) {
                    Text(
                        text = "View All ›",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFB45309),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Top 3 Players List
            topUsers.take(3).forEachIndexed { idx, user ->
                val medal = when (idx) {
                    0 -> "🥇"
                    1 -> "🥈"
                    else -> "🥉"
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = medal, fontSize = 16.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = user.avatarEmoji, fontSize = 18.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = user.name,
                            style = MaterialTheme.typography.bodySmall,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Text(
                            text = user.school,
                            style = MaterialTheme.typography.labelSmall,
                            color = ScTextMuted,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                    Text(
                        text = "${user.trophies} pts",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFB45309)
                    )
                }
            }
        }
    }
}

// Curriculum / Regional Country Filter Row
@Composable
fun CurriculumSelectorRow(
    selectedCurriculum: Curriculum,
    onCurriculumSelected: (Curriculum) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Curriculum.values().forEach { curriculum ->
            val isSelected = curriculum == selectedCurriculum
            FilterChip(
                selected = isSelected,
                onClick = { onCurriculumSelected(curriculum) },
                label = {
                    Text(
                        text = "${curriculum.flag} ${curriculum.shortCode}",
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        fontSize = 12.sp
                    )
                },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = ScPrimaryBlue,
                    selectedLabelColor = Color.White,
                    containerColor = ScSurface,
                    labelColor = ScForeground
                ),
                border = FilterChipDefaults.filterChipBorder(
                    borderColor = ScBorder,
                    selectedBorderColor = ScPrimaryBlue,
                    enabled = true,
                    selected = isSelected
                ),
                modifier = Modifier.testTag("curriculum_chip_${curriculum.shortCode}")
            )
        }
    }
}

// Subject Selector Row
@Composable
fun SubjectSelectorRow(
    selectedSubject: Subject,
    onSubjectSelected: (Subject) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Subject.values().forEach { subject ->
            val isSelected = subject == selectedSubject
            FilterChip(
                selected = isSelected,
                onClick = { onSubjectSelected(subject) },
                label = {
                    Text(
                        text = "${subject.iconEmoji} ${subject.displayName}",
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        fontSize = 12.sp
                    )
                },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = ScPrimaryIndigo,
                    selectedLabelColor = Color.White,
                    containerColor = ScSurface,
                    labelColor = ScForeground
                ),
                border = FilterChipDefaults.filterChipBorder(
                    borderColor = ScBorder,
                    selectedBorderColor = ScPrimaryIndigo,
                    enabled = true,
                    selected = isSelected
                ),
                modifier = Modifier.testTag("subject_chip_${subject.name}")
            )
        }
    }
}

// Exact Game Mode Card from SmartClass24 with Full-Bleed Rich Gradients
@Composable
fun ArenaModeCard(
    mode: ArenaMode,
    modifier: Modifier = Modifier,
    onPlayClick: () -> Unit
) {
    val gradientBrush = when (mode) {
        ArenaMode.SOLO_SPRINT -> Brush.linearGradient(listOf(ScPracticeStart, ScPracticeEnd))
        ArenaMode.QUICK_DUEL -> Brush.linearGradient(listOf(ScQuickMatchStart, ScQuickMatchEnd))
        ArenaMode.ROOM_CHALLENGE -> Brush.linearGradient(listOf(ScChallengeFriendStart, ScChallengeFriendEnd))
        ArenaMode.BOSS_BATTLE -> Brush.linearGradient(listOf(ScBossBattleStart, ScBossBattleEnd))
        ArenaMode.SCHOOL_BATTLE -> Brush.linearGradient(listOf(ScSchoolBattleStart, ScSchoolBattleEnd))
        ArenaMode.TOURNAMENTS -> Brush.linearGradient(listOf(ScTournamentStart, ScTournamentEnd))
        ArenaMode.ROCKET_RACE -> Brush.linearGradient(listOf(ScLargeScreenStart, ScLargeScreenMid, ScLargeScreenEnd))
    }

    val iconEmoji = when (mode) {
        ArenaMode.SOLO_SPRINT -> "🧠"
        ArenaMode.QUICK_DUEL -> "⚡"
        ArenaMode.ROOM_CHALLENGE -> "👥"
        ArenaMode.BOSS_BATTLE -> "🤖"
        ArenaMode.SCHOOL_BATTLE -> "🏫"
        ArenaMode.TOURNAMENTS -> "🏆"
        ArenaMode.ROCKET_RACE -> "🚀"
    }

    val displayTitle = when (mode) {
        ArenaMode.SOLO_SPRINT -> "Practice Mode"
        ArenaMode.QUICK_DUEL -> "Quick Match"
        ArenaMode.ROOM_CHALLENGE -> "Challenge Friend"
        ArenaMode.BOSS_BATTLE -> "Boss Battle"
        ArenaMode.SCHOOL_BATTLE -> "School Battle"
        ArenaMode.TOURNAMENTS -> "Tournaments"
        ArenaMode.ROCKET_RACE -> "Large Screen Arena"
    }

    val displaySubtitle = when (mode) {
        ArenaMode.SOLO_SPRINT -> "Sharpen your skills without affecting your rating"
        ArenaMode.QUICK_DUEL -> "Instant matchmaking with students at your level"
        ArenaMode.ROOM_CHALLENGE -> "Challenge a specific friend or classmate directly"
        ArenaMode.BOSS_BATTLE -> "Challenge the top-ranked AI bosses"
        ArenaMode.SCHOOL_BATTLE -> "Battle students from rival institutions for school leaderboard points"
        ArenaMode.TOURNAMENTS -> "Compete in single elimination championships for glory and exclusive prizes"
        ArenaMode.ROCKET_RACE -> "Power up your city or race rockets to victory on large displays"
    }

    val actionButtonText = when (mode) {
        ArenaMode.SOLO_SPRINT -> "Start Practice"
        ArenaMode.QUICK_DUEL -> "Find Match"
        ArenaMode.ROOM_CHALLENGE -> "Challenge Friend"
        ArenaMode.BOSS_BATTLE -> "Start Battle"
        ArenaMode.SCHOOL_BATTLE -> "Enter School Arena"
        ArenaMode.TOURNAMENTS -> "View Tournaments"
        ArenaMode.ROCKET_RACE -> "Open Large Screen Arena"
    }

    val buttonTextColor = when (mode) {
        ArenaMode.SOLO_SPRINT -> ScPracticeEnd
        ArenaMode.QUICK_DUEL -> ScQuickMatchEnd
        ArenaMode.ROOM_CHALLENGE -> ScChallengeFriendEnd
        ArenaMode.BOSS_BATTLE -> ScBossBattleEnd
        ArenaMode.SCHOOL_BATTLE -> ScSchoolBattleEnd
        ArenaMode.TOURNAMENTS -> ScTournamentEnd
        ArenaMode.ROCKET_RACE -> ScLargeScreenStart
    }

    val bulletPoints = when (mode) {
        ArenaMode.SOLO_SPRINT -> listOf("👤 Solo Practice", "⏱️ No time limit", "🛡️ No rating change")
        ArenaMode.QUICK_DUEL -> listOf("👥 2 Players", "⏱️ 2 minutes", "❓ 10 questions", "💎 100 pts/question")
        ArenaMode.ROOM_CHALLENGE -> listOf("👤 Choose opponent", "⚡ Instant notification", "🎯 Custom room code")
        ArenaMode.BOSS_BATTLE -> listOf("⚔️ Hard mode", "💎 High rewards", "🏆 AI Bosses")
        ArenaMode.SCHOOL_BATTLE -> listOf("🏫 Rep your school", "🏆 School leaderboard", "⚔️ Rival matchups")
        ArenaMode.TOURNAMENTS -> listOf("🏆 Elimination brackets", "⚡ Live matches", "🎖️ Badges & XP prizes")
        ArenaMode.ROCKET_RACE -> listOf("🖥️ Designed for smartboards", "👥 Two-team battle", "✨ Confetti & rockets")
    }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("mode_card_${mode.name}"),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.Transparent)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(gradientBrush)
                .padding(18.dp)
        ) {
            Column(modifier = Modifier.fillMaxWidth()) {
                // Top Header Row with Emoji Icon & Mode Title
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = CircleShape,
                        color = Color.White.copy(alpha = 0.25f),
                        modifier = Modifier.size(46.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(text = iconEmoji, fontSize = 24.sp)
                        }
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = displayTitle,
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Black,
                                color = Color.White
                            )

                            if (mode == ArenaMode.ROCKET_RACE) {
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = Color(0xFFF59E0B)
                                ) {
                                    Text(
                                        text = "2 Games",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = displaySubtitle,
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.White.copy(alpha = 0.9f),
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Feature Bullets
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    bulletPoints.forEach { point ->
                        Text(
                            text = point,
                            style = MaterialTheme.typography.labelMedium,
                            color = Color.White.copy(alpha = 0.95f),
                            fontWeight = FontWeight.Medium
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Solid White Action Button with Colored Text
                Button(
                    onClick = onPlayClick,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color.White,
                        contentColor = buttonTextColor
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("mode_action_button_${mode.name}")
                ) {
                    Text(
                        text = actionButtonText,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                        contentDescription = "Arrow",
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

// In-Game Option Button matching SmartClass24 QuestionRenderer
@Composable
fun BattleOptionButton(
    optionText: String,
    optionLetter: String,
    isSelected: Boolean,
    isAnswerSubmitted: Boolean,
    isCorrectOption: Boolean,
    isEliminated: Boolean,
    onOptionClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val backgroundColor by animateColorAsState(
        targetValue = when {
            isEliminated -> ScSurfaceMuted.copy(alpha = 0.4f)
            isAnswerSubmitted && isCorrectOption -> Color(0xFFDCFCE7) // green-100
            isAnswerSubmitted && isSelected && !isCorrectOption -> Color(0xFFFEE2E2) // red-100
            isSelected -> Color(0xFFEFF6FF) // blue-50
            else -> ScSurface
        },
        animationSpec = tween(250),
        label = "btn_bg"
    )

    val borderColor by animateColorAsState(
        targetValue = when {
            isEliminated -> Color.Transparent
            isAnswerSubmitted && isCorrectOption -> ScSuccessGreen
            isAnswerSubmitted && isSelected && !isCorrectOption -> ScDestructiveRed
            isSelected -> ScPrimaryBlue
            else -> ScBorder
        },
        animationSpec = tween(250),
        label = "btn_border"
    )

    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(enabled = !isAnswerSubmitted && !isEliminated) { onOptionClick() }
            .testTag("option_button_$optionLetter"),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        border = BorderStroke(1.5.dp, borderColor)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Option Letter Circle
            Surface(
                shape = CircleShape,
                color = when {
                    isAnswerSubmitted && isCorrectOption -> ScSuccessGreen
                    isAnswerSubmitted && isSelected && !isCorrectOption -> ScDestructiveRed
                    isSelected -> ScPrimaryBlue
                    else -> Color(0xFFF1F5F9)
                },
                modifier = Modifier.size(34.dp),
                border = BorderStroke(1.dp, borderColor)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = optionLetter,
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = if (isSelected || isAnswerSubmitted) Color.White else ScForeground
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Text(
                text = optionText,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                color = if (isEliminated) ScTextMuted.copy(alpha = 0.4f) else ScForeground,
                modifier = Modifier.weight(1f)
            )

            if (isAnswerSubmitted) {
                Spacer(modifier = Modifier.width(8.dp))
                if (isCorrectOption) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = "Correct",
                        tint = ScSuccessGreen,
                        modifier = Modifier.size(22.dp)
                    )
                } else if (isSelected) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Incorrect",
                        tint = ScDestructiveRed,
                        modifier = Modifier.size(22.dp)
                    )
                }
            }
        }
    }
}

// PowerUp Bar for Tactical Boosts
@Composable
fun PowerUpBar(
    powerUps: List<PowerUp>,
    isAnswerSubmitted: Boolean,
    onUsePowerUp: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        powerUps.forEach { powerUp ->
            val isAvailable = powerUp.count > 0 && !isAnswerSubmitted
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = if (isAvailable) ScSurface else ScSurfaceMuted.copy(alpha = 0.5f),
                border = BorderStroke(
                    1.dp,
                    if (isAvailable) ScPrimaryBlue.copy(alpha = 0.5f) else ScBorder
                ),
                modifier = Modifier
                    .weight(1f)
                    .clickable(enabled = isAvailable) { onUsePowerUp(powerUp.id) }
                    .testTag("power_up_${powerUp.id}")
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text(text = powerUp.emoji, fontSize = 16.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Column {
                        Text(
                            text = powerUp.name,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = if (isAvailable) ScForeground else ScTextMuted.copy(alpha = 0.5f)
                        )
                        Text(
                            text = "Left: ${powerUp.count}",
                            style = MaterialTheme.typography.labelSmall,
                            color = ScPrimaryBlue,
                            fontSize = 9.sp
                        )
                    }
                }
            }
        }
    }
}

