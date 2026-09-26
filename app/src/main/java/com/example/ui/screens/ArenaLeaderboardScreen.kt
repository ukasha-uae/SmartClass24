package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.MilitaryTech
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.LeaderboardUser
import com.example.ui.theme.ScBackground
import com.example.ui.theme.ScBorder
import com.example.ui.theme.ScForeground
import com.example.ui.theme.ScPrimaryBlue
import com.example.ui.theme.ScPrimaryIndigo
import com.example.ui.theme.ScSuccessGreen
import com.example.ui.theme.ScSurface
import com.example.ui.theme.ScSurfaceMuted
import com.example.ui.theme.ScTextMuted
import com.example.viewmodel.ArenaUiState

@Composable
fun ArenaLeaderboardScreen(
    state: ArenaUiState,
    onTabSelect: (String) -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val tabs = listOf("Global", "S24 Academy", "UAE", "West Africa", "Schools")
    val isSchoolsTab = state.selectedLeaderboardTab == "Schools"

    val schoolRankings = listOf(
        Triple("S24 Innovation Academy", "Dubai & West Africa 🚀", 24500),
        Triple("Presbyterian Boys' Secondary (PRESEC)", "Legon, Ghana 🇬🇭", 18450),
        Triple("Dubai College", "Dubai, UAE 🇦🇪", 16200),
        Triple("Achimota School", "Greater Accra, Ghana 🇬🇭", 15800),
        Triple("King's College", "Lagos, Nigeria 🇳🇬", 14200),
        Triple("GEMS Modern Academy", "Dubai, UAE 🇦🇪", 13900),
        Triple("Opoku Ware School (OWASS)", "Kumasi, Ghana 🇬🇭", 12900),
        Triple("Wesley Girls' High School", "Cape Coast, Ghana 🇬🇭", 12600),
        Triple("Prempeh College", "Kumasi, Ghana 🇬🇭", 11400),
        Triple("SmartClass International Academy", "Dubai, UAE 🇦🇪", 9800)
    )

    val filteredList = when (state.selectedLeaderboardTab) {
        "S24 Academy" -> state.leaderboards.filter { it.region == "S24 Academy" || it.school.contains("Innovation") }
        "UAE" -> state.leaderboards.filter { it.region == "UAE" }
        "West Africa" -> state.leaderboards.filter { it.region == "West Africa" }
        else -> state.leaderboards
    }

    val topThree = filteredList.take(3)
    val remainingUsers = if (filteredList.size > 3) filteredList.drop(3) else emptyList()

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(ScBackground)
            .padding(horizontal = 16.dp)
            .testTag("leaderboard_screen"),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(8.dp))
            // Top Navigation Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack, modifier = Modifier.testTag("leaderboard_back_button")) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = ScForeground
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "Arena Championship Ranks",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Black,
                        color = ScForeground
                    )
                    Text(
                        text = "Top learners competing across UAE & Global",
                        style = MaterialTheme.typography.bodySmall,
                        color = ScTextMuted
                    )
                }
            }
        }

        // Region Tabs
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                tabs.forEach { tabName ->
                    val isSelected = tabName == state.selectedLeaderboardTab
                    FilterChip(
                        selected = isSelected,
                        onClick = { onTabSelect(tabName) },
                        label = {
                            Text(
                                text = when (tabName) {
                                    "Global" -> "🌍 Global"
                                    "S24 Academy" -> "🚀 S24 Academy"
                                    "UAE" -> "🇦🇪 UAE"
                                    "West Africa" -> "🇬🇭/🇳🇬 West Africa"
                                    else -> "🏫 Schools"
                                },
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
                            borderColor = if (isSelected) ScPrimaryBlue else ScBorder,
                            borderWidth = 1.dp,
                            enabled = true,
                            selected = isSelected
                        )
                    )
                }
            }
        }

        // Podium for Top 3 (only in student view)
        if (!isSchoolsTab && topThree.isNotEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFEFF6FF).copy(alpha = 0.5f)),
                    border = BorderStroke(1.5.dp, Color(0xFFBFDBFE))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Surface(
                            shape = RoundedCornerShape(50),
                            color = Color(0xFFFEF3C7),
                            border = BorderStroke(1.dp, Color(0xFFFDE68A))
                        ) {
                            Text(
                                text = "🏆 TOURNAMENT PODIUM",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFFB45309),
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 4.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly,
                            verticalAlignment = Alignment.Bottom
                        ) {
                            // 2nd Place
                            if (topThree.size >= 2) {
                                PodiumItem(user = topThree[1], rank = 2, heightDp = 90)
                            }

                            // 1st Place
                            PodiumItem(user = topThree[0], rank = 1, heightDp = 125)

                            // 3rd Place
                            if (topThree.size >= 3) {
                                PodiumItem(user = topThree[2], rank = 3, heightDp = 75)
                            }
                        }
                    }
                }
            }
        }

        // Leaderboard List Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isSchoolsTab) "Top Participating Institutions" else "Rankings",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = ScForeground
                )
                Text(
                    text = if (isSchoolsTab) "Institutional Points" else "Trophy Road",
                    style = MaterialTheme.typography.labelSmall,
                    color = ScPrimaryBlue,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // Leaderboard Items
        if (isSchoolsTab) {
            items(schoolRankings.size) { index ->
                val school = schoolRankings[index]
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = ScSurface),
                    border = BorderStroke(1.5.dp, ScBorder)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "#${index + 1}",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = ScPrimaryBlue,
                            modifier = Modifier.width(36.dp)
                        )
                        Surface(
                            shape = CircleShape,
                            color = Color(0xFFEFF6FF),
                            border = BorderStroke(1.dp, Color(0xFFBFDBFE)),
                            modifier = Modifier.size(38.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(text = "🏫", fontSize = 18.sp)
                            }
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = school.first,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Bold,
                                color = ScForeground,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Text(
                                text = school.second,
                                style = MaterialTheme.typography.bodySmall,
                                color = ScTextMuted,
                                fontSize = 11.sp
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "${school.third} pts",
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFD97706)
                            )
                            Text(
                                text = "Verified",
                                style = MaterialTheme.typography.labelSmall,
                                color = ScSuccessGreen,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 10.sp
                            )
                        }
                    }
                }
            }
        } else {
            items(remainingUsers) { user ->
                LeaderboardUserRow(user = user)
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun PodiumItem(
    user: LeaderboardUser,
    rank: Int,
    heightDp: Int
) {
    val medalColor = when (rank) {
        1 -> Color(0xFFF59E0B) // Gold
        2 -> Color(0xFF94A3B8) // Silver
        else -> Color(0xFFD97706) // Bronze
    }

    val pedestalColor = when (rank) {
        1 -> Color(0xFFFEF3C7)
        2 -> Color(0xFFF1F5F9)
        else -> Color(0xFFFFEDD5)
    }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = user.avatarEmoji,
            fontSize = if (rank == 1) 32.sp else 26.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = user.name.split(" ").firstOrNull() ?: user.name,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = ScForeground,
            maxLines = 1
        )
        Text(
            text = "${user.trophies} 🏆",
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = medalColor,
            fontSize = 11.sp
        )
        Spacer(modifier = Modifier.height(6.dp))

        // Pedestal Box
        Box(
            modifier = Modifier
                .width(72.dp)
                .height(heightDp.dp)
                .background(
                    pedestalColor,
                    RoundedCornerShape(topStart = 10.dp, topEnd = 10.dp)
                )
                .padding(8.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "#$rank",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.ExtraBold,
                color = medalColor
            )
        }
    }
}

@Composable
fun LeaderboardUserRow(
    user: LeaderboardUser,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (user.isCurrentUser) Color(0xFFEFF6FF)
            else ScSurface
        ),
        border = BorderStroke(
            1.5.dp,
            if (user.isCurrentUser) ScPrimaryBlue else ScBorder
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "#${user.rank}",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = if (user.isCurrentUser) ScPrimaryBlue else ScTextMuted,
                modifier = Modifier.width(36.dp)
            )

            Surface(
                shape = CircleShape,
                color = Color.White,
                border = BorderStroke(1.5.dp, if (user.isCurrentUser) ScPrimaryBlue else ScBorder),
                modifier = Modifier.size(38.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(text = user.avatarEmoji, fontSize = 20.sp)
                }
            }

            Spacer(modifier = Modifier.width(10.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = if (user.isCurrentUser) "${user.name} (You)" else user.name,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = ScForeground,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = user.regionFlag, fontSize = 12.sp)
                }
                Text(
                    text = "${user.school} • ${user.tier}",
                    style = MaterialTheme.typography.bodySmall,
                    color = ScTextMuted,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    fontSize = 11.sp
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "${user.trophies} 🏆",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFD97706)
                )
                Text(
                    text = "${user.winRate}% win",
                    style = MaterialTheme.typography.labelSmall,
                    color = ScSuccessGreen,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 10.sp
                )
            }
        }
    }
}
