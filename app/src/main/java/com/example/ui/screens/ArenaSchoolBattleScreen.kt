package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
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
import com.example.model.SchoolRanking
import com.example.model.Subject
import com.example.ui.theme.ScBackground
import com.example.ui.theme.ScBorder
import com.example.ui.theme.ScForeground
import com.example.ui.theme.ScPrimaryBlue
import com.example.ui.theme.ScPrimaryIndigo
import com.example.ui.theme.ScSchoolBattleEnd
import com.example.ui.theme.ScSchoolBattleStart
import com.example.ui.theme.ScSurface
import com.example.ui.theme.ScSurfaceMuted
import com.example.ui.theme.ScTextMuted
import com.example.viewmodel.ArenaUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ArenaSchoolBattleScreen(
    state: ArenaUiState,
    onBack: () -> Unit,
    onSelectRivalSchool: (String) -> Unit,
    onSearchQueryChange: (String) -> Unit,
    onTabSelected: (String) -> Unit,
    onSubjectSelected: (Subject) -> Unit,
    onStartBattle: () -> Unit
) {
    val mySchoolRanking = state.schoolRankings.find { it.isMySchool }
        ?: state.schoolRankings.find { it.school.contains(state.userProfile.school, ignoreCase = true) }
        ?: state.schoolRankings.firstOrNull()

    val filteredSchools = state.schoolRankings.filter { ranking ->
        val matchesTab = when (state.selectedSchoolTab) {
            "S24 Academy" -> ranking.country.equals("Global", ignoreCase = true) ||
                    ranking.type.equals("STEM", ignoreCase = true) ||
                    ranking.school.contains("Innovation", ignoreCase = true)
            "Ghana" -> ranking.country.equals("Ghana", ignoreCase = true)
            "UAE" -> ranking.country.equals("UAE", ignoreCase = true)
            "Nigeria" -> ranking.country.equals("Nigeria", ignoreCase = true)
            else -> true
        }
        val matchesQuery = state.schoolSearchQuery.isBlank() ||
                ranking.school.contains(state.schoolSearchQuery, ignoreCase = true) ||
                ranking.region.contains(state.schoolSearchQuery, ignoreCase = true)
        matchesTab && matchesQuery
    }

    val selectedRival = state.schoolRankings.find { it.schoolId == state.selectedRivalSchoolId }
        ?: filteredSchools.firstOrNull { it.schoolId != mySchoolRanking?.schoolId }

    Scaffold(
        modifier = Modifier
            .fillMaxSize()
            .testTag("school_battle_screen"),
        containerColor = ScBackground,
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "School Battle Championship",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Text(
                            text = "Inter-School League • SmartClass24",
                            style = MaterialTheme.typography.bodySmall,
                            color = ScTextMuted
                        )
                    }
                },
                navigationIcon = {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier.testTag("school_battle_back_button")
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back to Lobby",
                            tint = ScForeground
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = ScSurface)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(vertical = 14.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // 1. My School Hero Banner Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.Transparent)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                Brush.linearGradient(
                                    listOf(ScSchoolBattleStart, ScSchoolBattleEnd)
                                )
                            )
                            .padding(18.dp)
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Surface(
                                        shape = CircleShape,
                                        color = Color.White.copy(alpha = 0.25f),
                                        modifier = Modifier.size(38.dp)
                                    ) {
                                        Box(contentAlignment = Alignment.Center) {
                                            Text(text = "🏫", fontSize = 20.sp)
                                        }
                                    }
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Column {
                                        Text(
                                            text = "YOUR INSTITUTION",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White.copy(alpha = 0.85f),
                                            letterSpacing = 1.sp
                                        )
                                        Text(
                                            text = state.userProfile.school,
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Black,
                                            color = Color.White
                                        )
                                    }
                                }

                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = Color.White.copy(alpha = 0.22f)
                                ) {
                                    Text(
                                        text = "Rank #${mySchoolRanking?.rank ?: 6}",
                                        style = MaterialTheme.typography.labelMedium,
                                        fontWeight = FontWeight.Black,
                                        color = Color.White,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            // Mini Stats Row
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Surface(
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp),
                                    color = Color.White.copy(alpha = 0.18f)
                                ) {
                                    Column(
                                        modifier = Modifier.padding(8.dp),
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        Text(
                                            text = "${mySchoolRanking?.points ?: 9800}",
                                            style = MaterialTheme.typography.titleSmall,
                                            fontWeight = FontWeight.Black,
                                            color = Color.White
                                        )
                                        Text(
                                            text = "Points",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = Color.White.copy(alpha = 0.85f)
                                        )
                                    }
                                }

                                Surface(
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp),
                                    color = Color.White.copy(alpha = 0.18f)
                                ) {
                                    Column(
                                        modifier = Modifier.padding(8.dp),
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        Text(
                                            text = "${mySchoolRanking?.totalWins ?: 390}",
                                            style = MaterialTheme.typography.titleSmall,
                                            fontWeight = FontWeight.Black,
                                            color = Color.White
                                        )
                                        Text(
                                            text = "Wins",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = Color.White.copy(alpha = 0.85f)
                                        )
                                    }
                                }

                                Surface(
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp),
                                    color = Color.White.copy(alpha = 0.18f)
                                ) {
                                    Column(
                                        modifier = Modifier.padding(8.dp),
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        Text(
                                            text = "${mySchoolRanking?.averageRating ?: 1520}",
                                            style = MaterialTheme.typography.titleSmall,
                                            fontWeight = FontWeight.Black,
                                            color = Color.White
                                        )
                                        Text(
                                            text = "Avg Rating",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = Color.White.copy(alpha = 0.85f)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 2. Battle Subject Selection
            item {
                Column {
                    Text(
                        text = "Battle Subject",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = ScForeground
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(
                            listOf(
                                Subject.ALL,
                                Subject.MATHEMATICS,
                                Subject.INTEGRATED_SCIENCE,
                                Subject.PHYSICS,
                                Subject.CHEMISTRY,
                                Subject.BIOLOGY,
                                Subject.COMPUTING_AI,
                                Subject.ENGLISH_LOGIC,
                                Subject.SOCIAL_STUDIES
                            )
                        ) { subj ->
                            val isSelected = state.selectedSubject == subj
                            FilterChip(
                                selected = isSelected,
                                onClick = { onSubjectSelected(subj) },
                                label = {
                                    Text(
                                        text = "${subj.iconEmoji} ${subj.displayName}",
                                        style = MaterialTheme.typography.labelMedium,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                    )
                                },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = ScPrimaryBlue,
                                    selectedLabelColor = Color.White,
                                    containerColor = ScSurface,
                                    labelColor = ScForeground
                                ),
                                border = FilterChipDefaults.filterChipBorder(
                                    enabled = true,
                                    selected = isSelected,
                                    borderColor = ScBorder,
                                    selectedBorderColor = ScPrimaryBlue
                                )
                            )
                        }
                    }
                }
            }

            // 3. Country / Region Filter Tabs
            item {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Select Rival Institution",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Text(
                            text = "${filteredSchools.size} Schools",
                            style = MaterialTheme.typography.bodySmall,
                            color = ScTextMuted
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Region Tabs
                    LazyRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(listOf("All", "S24 Academy", "Ghana", "UAE", "Nigeria")) { tab ->
                            val isSelected = state.selectedSchoolTab == tab
                            Surface(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .clickable { onTabSelected(tab) },
                                color = if (isSelected) ScPrimaryBlue else ScSurface,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (isSelected) ScPrimaryBlue else ScBorder
                                )
                            ) {
                                Box(
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = tab,
                                        style = MaterialTheme.typography.labelMedium,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                        color = if (isSelected) Color.White else ScForeground
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Search Field
                    OutlinedTextField(
                        value = state.schoolSearchQuery,
                        onValueChange = onSearchQueryChange,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("school_search_input"),
                        placeholder = {
                            Text("Search school by name or region...", style = MaterialTheme.typography.bodyMedium, color = ScTextMuted)
                        },
                        leadingIcon = {
                            Icon(Icons.Default.Search, contentDescription = "Search", tint = ScTextMuted)
                        },
                        trailingIcon = {
                            if (state.schoolSearchQuery.isNotEmpty()) {
                                IconButton(onClick = { onSearchQueryChange("") }) {
                                    Icon(Icons.Default.Clear, contentDescription = "Clear", tint = ScTextMuted)
                                }
                            }
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = ScSurface,
                            unfocusedContainerColor = ScSurface,
                            focusedBorderColor = ScPrimaryBlue,
                            unfocusedBorderColor = ScBorder
                        )
                    )
                }
            }

            // 4. Schools Ranking Roster
            items(filteredSchools, key = { it.schoolId }) { school ->
                val isSelected = school.schoolId == state.selectedRivalSchoolId
                val isMySchool = school.isMySchool

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .clickable {
                            if (!isMySchool) {
                                onSelectRivalSchool(school.schoolId)
                            }
                        }
                        .testTag("school_item_${school.schoolId}"),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isSelected) Color(0xFFF5F3FF) else ScSurface
                    ),
                    border = androidx.compose.foundation.BorderStroke(
                        if (isSelected) 2.dp else 1.dp,
                        if (isSelected) ScSchoolBattleStart else ScBorder
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            // Rank Badge
                            Surface(
                                shape = CircleShape,
                                color = when (school.rank) {
                                    1 -> Color(0xFFFEF3C7)
                                    2 -> Color(0xFFF1F5F9)
                                    3 -> Color(0xFFFED7AA)
                                    else -> ScSurfaceMuted
                                },
                                modifier = Modifier.size(38.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = when (school.rank) {
                                            1 -> "🥇"
                                            2 -> "🥈"
                                            3 -> "🥉"
                                            else -> "#${school.rank}"
                                        },
                                        fontSize = if (school.rank <= 3) 18.sp else 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = ScForeground
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(10.dp))

                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = school.school,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = ScForeground
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = school.flag, fontSize = 14.sp)
                                }
                                Text(
                                    text = "${school.region} • ${school.totalStudents} students • ${school.totalWins} wins",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = ScTextMuted
                                )
                            }
                        }

                        // Right action/indicator
                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "${school.points} pts",
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.Black,
                                color = ScPrimaryBlue
                            )
                            if (isMySchool) {
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = Color(0xFFDCFCE7)
                                ) {
                                    Text(
                                        text = "YOUR SCHOOL",
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF15803D),
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            } else if (isSelected) {
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = ScSchoolBattleStart
                                ) {
                                    Text(
                                        text = "SELECTED RIVAL",
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Bottom Spacing for Floating Match Button
            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }

    // Floating Launch Button at Bottom
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        contentAlignment = Alignment.BottomCenter
    ) {
        Button(
            onClick = onStartBattle,
            enabled = !state.isStartingSchoolBattle && selectedRival != null,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp)
                .testTag("start_school_battle_button"),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = ScSchoolBattleStart,
                disabledContainerColor = ScSchoolBattleStart.copy(alpha = 0.5f)
            )
        ) {
            if (state.isStartingSchoolBattle) {
                CircularProgressIndicator(
                    color = Color.White,
                    strokeWidth = 2.5.dp,
                    modifier = Modifier.size(22.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "Entering School Arena...",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            } else {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "⚔️", fontSize = 18.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (selectedRival != null)
                            "Battle ${selectedRival.school.substringBefore("(").trim()}"
                        else "Select Rival School",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }
    }
}
