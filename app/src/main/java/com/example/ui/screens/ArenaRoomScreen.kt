package com.example.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Numbers
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.FriendPlayer
import com.example.model.Subject
import com.example.ui.theme.ScBackground
import com.example.ui.theme.ScBorder
import com.example.ui.theme.ScForeground
import com.example.ui.theme.ScPrimaryBlue
import com.example.ui.theme.ScSurface
import com.example.ui.theme.ScSurfaceMuted
import com.example.ui.theme.ScTextMuted
import com.example.viewmodel.ArenaUiState

@Composable
fun ArenaRoomScreen(
    state: ArenaUiState,
    onSelectFriend: (String) -> Unit = {},
    onSearchQueryChange: (String) -> Unit = {},
    onTabChange: (Int) -> Unit = {},
    onClassLevelChange: (String) -> Unit = {},
    onSubjectChange: (Subject) -> Unit = {},
    onQuestionCountChange: (Int) -> Unit = {},
    onTimeLimitChange: (Int) -> Unit = {},
    onStartFriendChallenge: () -> Unit = {},
    onRoomCodeChange: (String) -> Unit,
    onHostRoom: () -> Unit,
    onCancelHosting: () -> Unit,
    onJoinRoom: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val tabs = listOf("👥 Select Friend", "🔢 Room Code")

    val filteredFriends = remember(state.friendsList, state.friendSearchQuery) {
        if (state.friendSearchQuery.isBlank()) {
            state.friendsList
        } else {
            state.friendsList.filter { friend ->
                friend.name.contains(state.friendSearchQuery, ignoreCase = true) ||
                        friend.school.contains(state.friendSearchQuery, ignoreCase = true)
            }
        }
    }

    val selectedFriend = remember(state.friendsList, state.selectedFriendId) {
        state.friendsList.find { it.id == state.selectedFriendId }
            ?: state.friendsList.firstOrNull()
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(ScBackground)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
            .testTag("arena_room_screen")
    ) {
        // Navigation Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack, modifier = Modifier.testTag("room_back_button")) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = ScForeground
                )
            }
            Spacer(modifier = Modifier.width(8.dp))
            Column {
                Text(
                    text = "Challenge a Friend",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Black,
                    color = ScForeground
                )
                Text(
                    text = "Pick a friend or classmate to duel directly in real-time",
                    style = MaterialTheme.typography.bodySmall,
                    color = ScTextMuted
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Dual Tabs: Select Friend (Web-aligned direct friend picker) & Room Code
        TabRow(
            selectedTabIndex = state.selectedFriendTab,
            containerColor = ScSurface,
            contentColor = ScPrimaryBlue,
            indicator = { tabPositions ->
                TabRowDefaults.SecondaryIndicator(
                    modifier = Modifier.tabIndicatorOffset(tabPositions[state.selectedFriendTab]),
                    color = ScPrimaryBlue
                )
            },
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
        ) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = state.selectedFriendTab == index,
                    onClick = { onTabChange(index) },
                    text = {
                        Text(
                            text = title,
                            fontWeight = if (state.selectedFriendTab == index) FontWeight.Bold else FontWeight.Medium,
                            fontSize = 14.sp
                        )
                    },
                    modifier = Modifier.testTag(if (index == 0) "friend_tab_select" else "room_tab_code")
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (state.selectedFriendTab == 0) {
            // TAB 0: SELECT FRIEND (Matches SmartClass24 Web App)
            FriendSelectionView(
                friends = filteredFriends,
                selectedFriend = selectedFriend,
                searchQuery = state.friendSearchQuery,
                onSearchQueryChange = onSearchQueryChange,
                onSelectFriend = onSelectFriend,
                selectedSubject = state.selectedSubject,
                onSubjectChange = onSubjectChange,
                selectedClassLevel = state.selectedChallengeClassLevel,
                onClassLevelChange = onClassLevelChange,
                selectedQuestionCount = state.selectedQuestionCount,
                onQuestionCountChange = onQuestionCountChange,
                selectedTimeLimit = state.selectedTimeLimitSeconds,
                onTimeLimitChange = onTimeLimitChange,
                isSendingChallenge = state.isSendingChallenge,
                challengeFeedback = state.challengeFeedback,
                onStartFriendChallenge = onStartFriendChallenge
            )
        } else {
            // TAB 1: ROOM CODE (Match code hosting and joining)
            RoomCodeView(
                state = state,
                context = context,
                onRoomCodeChange = onRoomCodeChange,
                onHostRoom = onHostRoom,
                onCancelHosting = onCancelHosting,
                onJoinRoom = onJoinRoom
            )
        }
    }
}

@Composable
private fun FriendSelectionView(
    friends: List<FriendPlayer>,
    selectedFriend: FriendPlayer?,
    searchQuery: String,
    onSearchQueryChange: (String) -> Unit,
    onSelectFriend: (String) -> Unit,
    selectedSubject: Subject,
    onSubjectChange: (Subject) -> Unit,
    selectedClassLevel: String,
    onClassLevelChange: (String) -> Unit,
    selectedQuestionCount: Int,
    onQuestionCountChange: (Int) -> Unit,
    selectedTimeLimit: Int,
    onTimeLimitChange: (Int) -> Unit,
    isSendingChallenge: Boolean,
    challengeFeedback: String?,
    onStartFriendChallenge: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        // Search Friend Input
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = ScSurface),
            border = BorderStroke(1.dp, ScBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Choose Opponent",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = ScForeground
                    )
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFDCFCE7),
                        border = BorderStroke(1.dp, Color(0xFF86EFAC))
                    ) {
                        Text(
                            text = "🟢 Online First",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF166534),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = onSearchQueryChange,
                    placeholder = { Text("Search friend by name or school...") },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = ScTextMuted
                        )
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { onSearchQueryChange("") }) {
                                Icon(
                                    imageVector = Icons.Default.Clear,
                                    contentDescription = "Clear search",
                                    tint = ScTextMuted
                                )
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = ScPrimaryBlue,
                        unfocusedBorderColor = ScBorder,
                        focusedTextColor = ScForeground,
                        unfocusedTextColor = ScForeground
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("friend_search_input")
                )

                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "🤖 Sarah (AI Study Partner) is always online to practice any topic!",
                    style = MaterialTheme.typography.bodySmall,
                    color = ScTextMuted,
                    fontSize = 11.sp
                )
            }
        }

        // Friends List
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            if (friends.isEmpty()) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = ScSurfaceMuted,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier.padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No friends found matching \"$searchQuery\"",
                            style = MaterialTheme.typography.bodyMedium,
                            color = ScTextMuted
                        )
                    }
                }
            } else {
                friends.forEach { friend ->
                    val isSelected = selectedFriend?.id == friend.id
                    FriendItemCard(
                        friend = friend,
                        isSelected = isSelected,
                        onClick = { onSelectFriend(friend.id) }
                    )
                }
            }
        }

        // Challenge Configuration Settings (Class level, Subject, Questions, Timer)
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = ScSurface),
            border = BorderStroke(1.dp, ScBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Match Settings",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = ScForeground
                )
                Text(
                    text = "Configure curriculum level, rounds, and question timer",
                    style = MaterialTheme.typography.bodySmall,
                    color = ScTextMuted
                )

                Spacer(modifier = Modifier.height(14.dp))

                // 1. Education Level / Class
                Text(
                    text = "Class Level",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = ScForeground
                )
                Spacer(modifier = Modifier.height(6.dp))
                val classLevels = listOf("JHS 1", "JHS 2", "JHS 3", "SHS 1", "SHS 2", "SHS 3")
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    classLevels.forEach { level ->
                        FilterChip(
                            selected = selectedClassLevel == level,
                            onClick = { onClassLevelChange(level) },
                            label = { Text(level, fontWeight = FontWeight.Bold, fontSize = 12.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = ScPrimaryBlue,
                                selectedLabelColor = Color.White
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // 2. Battle Subject
                Text(
                    text = "Battle Subject",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = ScForeground
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
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
                    ).forEach { subj ->
                        FilterChip(
                            selected = selectedSubject == subj,
                            onClick = { onSubjectChange(subj) },
                            label = {
                                Text(
                                    "${subj.iconEmoji} ${subj.displayName}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = ScPrimaryBlue,
                                selectedLabelColor = Color.White
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // 3. Question Count & Timer Rows
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Question Count
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Rounds",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            listOf(5, 10).forEach { count ->
                                FilterChip(
                                    selected = selectedQuestionCount == count,
                                    onClick = { onQuestionCountChange(count) },
                                    label = { Text("$count Qs", fontWeight = FontWeight.Bold, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = ScPrimaryBlue,
                                        selectedLabelColor = Color.White
                                    )
                                )
                            }
                        }
                    }

                    // Time limit
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Timer",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            listOf(30, 45, 60, 90).forEach { seconds ->
                                FilterChip(
                                    selected = selectedTimeLimit == seconds,
                                    onClick = { onTimeLimitChange(seconds) },
                                    label = { Text("${seconds}s", fontWeight = FontWeight.Bold, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = ScPrimaryBlue,
                                        selectedLabelColor = Color.White
                                    )
                                )
                            }
                        }
                    }
                }
            }
        }

        // Opponent Preview & Start Challenge Action
        if (selectedFriend != null) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFEFF6FF)),
                border = BorderStroke(1.5.dp, Color(0xFFBFDBFE)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Color.White,
                            border = BorderStroke(1.dp, Color(0xFFBFDBFE)),
                            modifier = Modifier.size(50.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(text = selectedFriend.avatarEmoji, fontSize = 24.sp)
                            }
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "VS ${selectedFriend.name}",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Black,
                                    color = ScPrimaryBlue
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                if (selectedFriend.isBot) {
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = Color(0xFFDCFCE7),
                                        border = BorderStroke(1.dp, Color(0xFF86EFAC))
                                    ) {
                                        Text(
                                            text = "🤖 AI Partner",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Bold,
                                            color = Color(0xFF166534),
                                            fontSize = 10.sp,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }
                            }
                            Text(
                                text = "${selectedFriend.school} ${selectedFriend.flag}",
                                style = MaterialTheme.typography.bodySmall,
                                color = ScTextMuted
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color.White,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Topic: ${selectedSubject.displayName}",
                                style = MaterialTheme.typography.bodySmall,
                                fontWeight = FontWeight.SemiBold,
                                color = ScForeground
                            )
                            Text(
                                text = "$selectedQuestionCount Rounds • ${selectedTimeLimit}s/Q",
                                style = MaterialTheme.typography.bodySmall,
                                fontWeight = FontWeight.Bold,
                                color = ScPrimaryBlue
                            )
                        }
                    }

                    if (challengeFeedback != null) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = challengeFeedback,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (challengeFeedback.contains("Sarah")) Color(0xFF15803D) else ScPrimaryBlue
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = onStartFriendChallenge,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = ScPrimaryBlue,
                            contentColor = Color.White
                        ),
                        enabled = !isSendingChallenge,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                            .testTag("challenge_friend_button")
                    ) {
                        if (isSendingChallenge) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Preparing Match...", fontWeight = FontWeight.Bold)
                        } else {
                            Icon(imageVector = Icons.Default.Bolt, contentDescription = "Challenge")
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Challenge ${selectedFriend.name.substringBefore(" ")}",
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
    }
}

@Composable
private fun FriendItemCard(
    friend: FriendPlayer,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) ScPrimaryBlue.copy(alpha = 0.08f) else ScSurface
        ),
        border = BorderStroke(
            width = if (isSelected) 2.dp else 1.dp,
            color = if (isSelected) ScPrimaryBlue else ScBorder
        ),
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .testTag("friend_item_${friend.id}")
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Avatar with Online indicator badge
            Box(contentAlignment = Alignment.BottomEnd) {
                Surface(
                    shape = CircleShape,
                    color = if (friend.isBot) Color(0xFFDCFCE7) else ScSurfaceMuted,
                    border = BorderStroke(1.dp, if (isSelected) ScPrimaryBlue else ScBorder),
                    modifier = Modifier.size(44.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(text = friend.avatarEmoji, fontSize = 22.sp)
                    }
                }

                if (friend.isOnline || friend.isBot) {
                    Surface(
                        shape = CircleShape,
                        color = Color(0xFF16A34A),
                        border = BorderStroke(2.dp, Color.White),
                        modifier = Modifier.size(13.dp)
                    ) {}
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            // Details
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = friend.name,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = ScForeground
                    )

                    if (friend.isBot) {
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = Color(0xFFDCFCE7),
                            border = BorderStroke(1.dp, Color(0xFF86EFAC))
                        ) {
                            Text(
                                text = "Always Online",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF166534),
                                fontSize = 9.sp,
                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp)
                            )
                        }
                    } else if (friend.isOnline) {
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = Color(0xFFDCFCE7),
                            border = BorderStroke(1.dp, Color(0xFF86EFAC))
                        ) {
                            Text(
                                text = "Online",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF166534),
                                fontSize = 9.sp,
                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp)
                            )
                        }
                    } else {
                        Text(
                            text = friend.statusText,
                            style = MaterialTheme.typography.labelSmall,
                            color = ScTextMuted,
                            fontSize = 10.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = friend.school,
                    style = MaterialTheme.typography.bodySmall,
                    color = ScTextMuted,
                    fontSize = 12.sp
                )

                Spacer(modifier = Modifier.height(2.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "${friend.flag} ${friend.level}",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.SemiBold,
                        color = ScPrimaryBlue,
                        fontSize = 11.sp
                    )
                    Text(
                        text = "•",
                        style = MaterialTheme.typography.labelSmall,
                        color = ScTextMuted
                    )
                    Text(
                        text = "${friend.rating} ELO (${friend.winRate}% win rate)",
                        style = MaterialTheme.typography.labelSmall,
                        color = ScTextMuted,
                        fontSize = 11.sp
                    )
                }
            }

            // Selection Checkmark
            if (isSelected) {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Selected",
                    tint = ScPrimaryBlue,
                    modifier = Modifier.size(24.dp)
                )
            } else {
                Icon(
                    imageVector = Icons.Default.RadioButtonUnchecked,
                    contentDescription = "Select",
                    tint = ScBorder,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

@Composable
private fun RoomCodeView(
    state: ArenaUiState,
    context: Context,
    onRoomCodeChange: (String) -> Unit,
    onHostRoom: () -> Unit,
    onCancelHosting: () -> Unit,
    onJoinRoom: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
        // Live Hosting Status Card (Active when user created a room)
        AnimatedVisibility(
            visible = state.isHostingRoom,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("active_room_card"),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7)),
                border = BorderStroke(1.5.dp, Color(0xFFFDE68A))
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Sensors,
                                contentDescription = "Live Room",
                                tint = Color(0xFFD97706)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "ROOM BROADCASTING",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Black,
                                color = Color(0xFFD97706)
                            )
                        }

                        CircularProgressIndicator(
                            modifier = Modifier.size(20.dp),
                            color = Color(0xFFD97706),
                            strokeWidth = 2.5.dp
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = "Share this 6-digit Code with your friend:",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFF92400E)
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = Color.White,
                        border = BorderStroke(1.5.dp, Color(0xFFFDE68A)),
                        modifier = Modifier.padding(vertical = 4.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = state.hostedRoomCode,
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Black,
                                fontFamily = FontFamily.Monospace,
                                color = Color(0xFFD97706)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            IconButton(
                                onClick = {
                                    val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                    val clip = ClipData.newPlainText("SmartClass Arena Code", state.hostedRoomCode)
                                    clipboard.setPrimaryClip(clip)
                                    Toast.makeText(context, "Code copied: ${state.hostedRoomCode}", Toast.LENGTH_SHORT).show()
                                },
                                modifier = Modifier.size(36.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.ContentCopy,
                                    contentDescription = "Copy Code",
                                    tint = Color(0xFFD97706)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = state.roomStatusMessage ?: "Waiting for classmate to join...",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF92400E)
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    OutlinedButton(
                        onClick = onCancelHosting,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = Color(0xFFB91C1C)
                        ),
                        border = BorderStroke(1.dp, Color(0xFFFCA5A5)),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("cancel_hosting_button")
                    ) {
                        Icon(imageVector = Icons.Default.Cancel, contentDescription = "Cancel")
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Cancel Room")
                    }
                }
            }
        }

        // Join Existing Room
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = ScSurface),
            border = BorderStroke(1.5.dp, Color(0xFFBFDBFE))
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = CircleShape,
                        color = Color(0xFFEFF6FF),
                        border = BorderStroke(1.dp, Color(0xFFBFDBFE)),
                        modifier = Modifier.size(42.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(text = "🎮", fontSize = 20.sp)
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Join Match Room",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Text(
                            text = "Enter the 6-character match code from a friend",
                            style = MaterialTheme.typography.bodySmall,
                            color = ScTextMuted
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = state.roomCodeInput,
                    onValueChange = onRoomCodeChange,
                    label = { Text("Match Code (e.g. SC-8241)") },
                    placeholder = { Text("SC-XXXX or 4 digits") },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("room_code_input"),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = ScPrimaryBlue,
                        unfocusedBorderColor = ScBorder,
                        focusedTextColor = ScForeground,
                        unfocusedTextColor = ScForeground
                    )
                )

                // Quick presets for fast code input
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf("SC-2024", "SC-8421", "SC-7711").forEach { sampleCode ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = ScSurfaceMuted,
                            border = BorderStroke(1.dp, ScBorder),
                            onClick = { onRoomCodeChange(sampleCode) },
                            modifier = Modifier.weight(1f)
                        ) {
                            Box(
                                modifier = Modifier.padding(vertical = 6.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = sampleCode,
                                    style = MaterialTheme.typography.labelSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = ScPrimaryBlue
                                )
                            }
                        }
                    }
                }

                if (state.roomErrorMessage != null) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = state.roomErrorMessage,
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFFDC2626)
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Button(
                    onClick = onJoinRoom,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("join_room_button"),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = ScPrimaryBlue,
                        contentColor = Color.White
                    ),
                    enabled = state.roomCodeInput.isNotBlank() && !state.isJoiningRoom
                ) {
                    if (state.isJoiningRoom) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(20.dp),
                            color = Color.White,
                            strokeWidth = 2.dp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = "Connecting...")
                    } else {
                        Text(
                            text = "Join Arena Battle",
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Host / Create New Room
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = ScSurface),
            border = BorderStroke(1.5.dp, Color(0xFFFDE68A))
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = CircleShape,
                        color = Color(0xFFFEF3C7),
                        border = BorderStroke(1.dp, Color(0xFFFDE68A)),
                        modifier = Modifier.size(42.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(text = "👑", fontSize = 20.sp)
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Host New Arena Match",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Text(
                            text = "Host a match using your chosen curriculum & subject",
                            style = MaterialTheme.typography.bodySmall,
                            color = ScTextMuted
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = ScSurfaceMuted,
                    border = BorderStroke(1.dp, ScBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Curriculum:", style = MaterialTheme.typography.bodySmall, color = ScTextMuted)
                            Text(text = state.selectedCurriculum.displayName, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold, color = ScPrimaryBlue)
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Subject:", style = MaterialTheme.typography.bodySmall, color = ScTextMuted)
                            Text(text = "${state.selectedSubject.iconEmoji} ${state.selectedSubject.displayName}", style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold, color = ScForeground)
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Rounds:", style = MaterialTheme.typography.bodySmall, color = ScTextMuted)
                            Text(text = "5 Rounds", style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold, color = ScForeground)
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Timer:", style = MaterialTheme.typography.bodySmall, color = ScTextMuted)
                            Text(text = "${state.selectedTimeLimitSeconds}s per question", style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold, color = ScForeground)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = onHostRoom,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("host_room_button"),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFD97706),
                        contentColor = Color.White
                    ),
                    enabled = !state.isHostingRoom
                ) {
                    Text(
                        text = if (state.isHostingRoom) "Broadcasting Room..." else "Create Room & Share Code",
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}
