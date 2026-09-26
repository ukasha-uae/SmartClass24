package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.SportsKabaddi
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import com.example.model.TournamentItem
import com.example.model.TournamentMatch
import com.example.model.TournamentRound
import com.example.ui.theme.ScBackground
import com.example.ui.theme.ScBorder
import com.example.ui.theme.ScForeground
import com.example.ui.theme.ScPrimaryBlue
import com.example.ui.theme.ScSurface
import com.example.ui.theme.ScSurfaceMuted
import com.example.ui.theme.ScTextMuted
import com.example.ui.theme.ScTournamentEnd
import com.example.ui.theme.ScTournamentStart
import com.example.viewmodel.ArenaUiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ArenaTournamentsScreen(
    state: ArenaUiState,
    onBack: () -> Unit,
    onSelectTab: (String) -> Unit,
    onViewBracket: (String) -> Unit,
    onCloseBracket: () -> Unit,
    onRegister: (String) -> Unit,
    onEnterMatch: (String) -> Unit
) {
    val selectedTournament = state.tournamentsList.find { it.id == state.selectedTournamentId }

    Scaffold(
        modifier = Modifier
            .fillMaxSize()
            .testTag("tournaments_screen"),
        containerColor = ScBackground,
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = if (state.isViewingBracket && selectedTournament != null)
                                selectedTournament.title
                            else "Tournaments Championship",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Text(
                            text = if (state.isViewingBracket) "Single Elimination Bracket • SmartClass24"
                            else "Compete for Glory & Exclusive Rewards",
                            style = MaterialTheme.typography.bodySmall,
                            color = ScTextMuted
                        )
                    }
                },
                navigationIcon = {
                    IconButton(
                        onClick = {
                            if (state.isViewingBracket) {
                                onCloseBracket()
                            } else {
                                onBack()
                            }
                        },
                        modifier = Modifier.testTag("tournaments_back_button")
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = ScForeground
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = ScSurface)
            )
        }
    ) { padding ->
        if (state.isViewingBracket && selectedTournament != null) {
            TournamentBracketView(
                tournament = selectedTournament,
                padding = padding,
                onEnterMatch = { onEnterMatch(selectedTournament.id) }
            )
        } else {
            TournamentListView(
                state = state,
                padding = padding,
                onSelectTab = onSelectTab,
                onViewBracket = onViewBracket,
                onRegister = onRegister,
                onEnterMatch = onEnterMatch
            )
        }
    }
}

@Composable
private fun TournamentListView(
    state: ArenaUiState,
    padding: PaddingValues,
    onSelectTab: (String) -> Unit,
    onViewBracket: (String) -> Unit,
    onRegister: (String) -> Unit,
    onEnterMatch: (String) -> Unit
) {
    val filteredList = state.tournamentsList.filter {
        when (state.selectedTournamentTab) {
            "upcoming" -> it.status == "registering"
            "active" -> it.status == "active"
            "completed" -> it.status == "completed"
            else -> true
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(padding)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 14.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Hero Card
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
                                listOf(ScTournamentStart, ScTournamentEnd)
                            )
                        )
                        .padding(18.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Color.White.copy(alpha = 0.25f),
                            modifier = Modifier.size(48.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(text = "🏆", fontSize = 26.sp)
                            }
                        }
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text(
                                text = "ARENA TOURNAMENTS",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = Color.White.copy(alpha = 0.85f),
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "Weekly Cups & Seasonal Leagues",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Black,
                                color = Color.White
                            )
                            Text(
                                text = "Earn Gold Badges, XP & School Prestige points",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.White.copy(alpha = 0.9f)
                            )
                        }
                    }
                }
            }
        }

        // Tabs (Upcoming / Live Now / Past Events)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(
                    "upcoming" to "Upcoming",
                    "active" to "Live Now 🔥",
                    "completed" to "Past Events"
                ).forEach { (key, label) ->
                    val isSelected = state.selectedTournamentTab == key
                    Surface(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .clickable { onSelectTab(key) }
                            .testTag("tournament_tab_$key"),
                        color = if (isSelected) ScPrimaryBlue else ScSurface,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (isSelected) ScPrimaryBlue else ScBorder
                        )
                    ) {
                        Box(
                            modifier = Modifier.padding(vertical = 10.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = label,
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else ScForeground
                            )
                        }
                    }
                }
            }
        }

        // Tournament Cards
        items(filteredList, key = { it.id }) { tournament ->
            TournamentCard(
                tournament = tournament,
                onViewBracket = { onViewBracket(tournament.id) },
                onRegister = { onRegister(tournament.id) },
                onEnterMatch = { onEnterMatch(tournament.id) }
            )
        }

        if (filteredList.isEmpty()) {
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 24.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = ScSurface),
                    border = androidx.compose.foundation.BorderStroke(1.dp, ScBorder)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(text = "🎯", fontSize = 32.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "No tournaments in this category",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Text(
                            text = "Check back soon for upcoming season cups!",
                            style = MaterialTheme.typography.bodySmall,
                            color = ScTextMuted
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun TournamentCard(
    tournament: TournamentItem,
    onViewBracket: () -> Unit,
    onRegister: () -> Unit,
    onEnterMatch: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("tournament_card_${tournament.id}"),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = ScSurface),
        border = androidx.compose.foundation.BorderStroke(
            if (tournament.status == "active") 1.5.dp else 1.dp,
            if (tournament.status == "active") Color(0xFFEF4444) else ScBorder
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = when (tournament.status) {
                            "active" -> Color(0xFFFEE2E2)
                            "completed" -> Color(0xFFDCFCE7)
                            else -> Color(0xFFFEF3C7)
                        },
                        modifier = Modifier.size(42.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(text = tournament.iconEmoji, fontSize = 20.sp)
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = tournament.title,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Text(
                            text = tournament.subject,
                            style = MaterialTheme.typography.bodySmall,
                            color = ScPrimaryBlue,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                if (tournament.status == "active") {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Color(0xFFEF4444)
                    ) {
                        Text(
                            text = "LIVE",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Black,
                            color = Color.White,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Metadata Chips
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.CalendarToday,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = ScTextMuted
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = tournament.startTime,
                        style = MaterialTheme.typography.bodySmall,
                        color = ScTextMuted
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Group,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = ScTextMuted
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${tournament.participants}/${tournament.maxParticipants} Joined",
                        style = MaterialTheme.typography.bodySmall,
                        color = ScTextMuted
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Prize Row
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(text = "🎁", fontSize = 14.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Prize: ${tournament.prize}",
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFD97706)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (tournament.rounds.isNotEmpty()) {
                    OutlinedButton(
                        onClick = onViewBracket,
                        modifier = Modifier
                            .weight(1f)
                            .testTag("view_bracket_${tournament.id}"),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("View Bracket")
                    }
                }

                when (tournament.status) {
                    "registering" -> {
                        Button(
                            onClick = onRegister,
                            enabled = !tournament.isRegistered,
                            modifier = Modifier
                                .weight(1f)
                                .testTag("register_tournament_${tournament.id}"),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = ScPrimaryBlue)
                        ) {
                            Text(if (tournament.isRegistered) "Registered ✓" else "Register Now")
                        }
                    }
                    "active" -> {
                        Button(
                            onClick = onEnterMatch,
                            modifier = Modifier
                                .weight(1f)
                                .testTag("enter_match_${tournament.id}"),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444))
                        ) {
                            Text("Enter Arena ⚔️")
                        }
                    }
                    "completed" -> {
                        OutlinedButton(
                            onClick = onViewBracket,
                            modifier = Modifier
                                .weight(1f)
                                .testTag("view_results_${tournament.id}"),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("View Champions")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TournamentBracketView(
    tournament: TournamentItem,
    padding: PaddingValues,
    onEnterMatch: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(padding)
            .padding(16.dp)
    ) {
        // Tournament Info Header
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = ScSurface),
            border = androidx.compose.foundation.BorderStroke(1.dp, ScBorder)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = tournament.title,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        if (tournament.status == "active") {
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = Color(0xFFEF4444)
                            ) {
                                Text(
                                    text = "LIVE",
                                    style = MaterialTheme.typography.labelSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }
                    Text(
                        text = "Single Elimination • ${tournament.maxParticipants} Players • ${tournament.subject}",
                        style = MaterialTheme.typography.bodySmall,
                        color = ScTextMuted
                    )
                }

                if (tournament.status == "active") {
                    Button(
                        onClick = onEnterMatch,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444)),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.testTag("bracket_enter_match_button")
                    ) {
                        Text("Battle Now ⚔️")
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "TOURNAMENT BRACKET",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Black,
            color = ScTextMuted,
            letterSpacing = 1.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Horizontal Scroll Bracket Board
        Box(
            modifier = Modifier
                .fillMaxSize()
                .clip(RoundedCornerShape(16.dp))
                .background(ScSurface)
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .horizontalScroll(scrollState),
                horizontalArrangement = Arrangement.spacedBy(28.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                tournament.rounds.forEach { round ->
                    RoundColumn(round = round)
                }

                // Champion Trophy Column
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                    modifier = Modifier.width(160.dp)
                ) {
                    Surface(
                        shape = CircleShape,
                        color = Color(0xFFFEF3C7),
                        border = androidx.compose.foundation.BorderStroke(3.dp, Color(0xFFF59E0B)),
                        modifier = Modifier.size(68.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(text = "🏆", fontSize = 34.sp)
                        }
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "CHAMPION",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Black,
                        color = ScForeground
                    )
                    Text(
                        text = if (tournament.status == "completed") "Sena K. 🥇" else "TBD",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = ScPrimaryBlue
                    )
                    Text(
                        text = tournament.prize,
                        style = MaterialTheme.typography.labelSmall,
                        color = ScTextMuted
                    )
                }
            }
        }
    }
}

@Composable
private fun RoundColumn(round: TournamentRound) {
    Column(
        modifier = Modifier.width(220.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Surface(
            shape = RoundedCornerShape(8.dp),
            color = ScSurfaceMuted,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = round.name,
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Bold,
                color = ScForeground,
                modifier = Modifier.padding(vertical = 6.dp, horizontal = 10.dp)
            )
        }

        round.matches.forEach { match ->
            MatchCardItem(match = match)
        }
    }
}

@Composable
private fun MatchCardItem(match: TournamentMatch) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("match_card_${match.id}"),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = ScBackground),
        border = androidx.compose.foundation.BorderStroke(
            if (match.isLive) 2.dp else 1.dp,
            if (match.isLive) Color(0xFFEF4444) else ScBorder
        )
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            if (match.isLive) {
                Surface(
                    color = Color(0xFFEF4444),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "LIVE MATCH",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                        modifier = Modifier.padding(vertical = 2.dp, horizontal = 8.dp)
                    )
                }
            }

            // Player 1 Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        if (match.winner == match.p1) Color(0xFFDCFCE7) else Color.Transparent
                    )
                    .padding(horizontal = 10.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = match.p1,
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = if (match.winner == match.p1) FontWeight.Bold else FontWeight.Medium,
                    color = ScForeground
                )
                Text(
                    text = match.s1?.toString() ?: "-",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = ScForeground
                )
            }

            // Divider
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(ScBorder)
            )

            // Player 2 Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        if (match.winner == match.p2) Color(0xFFDCFCE7) else Color.Transparent
                    )
                    .padding(horizontal = 10.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = match.p2,
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = if (match.winner == match.p2) FontWeight.Bold else FontWeight.Medium,
                    color = ScForeground
                )
                Text(
                    text = match.s2?.toString() ?: "-",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = ScForeground
                )
            }
        }
    }
}
