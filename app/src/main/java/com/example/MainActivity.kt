package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.model.ArenaMode
import com.example.ui.screens.ArenaAchievementsScreen
import com.example.ui.screens.ArenaBattleScreen
import com.example.ui.screens.ArenaLeaderboardScreen
import com.example.ui.screens.ArenaLobbyScreen
import com.example.ui.screens.ArenaResultScreen
import com.example.ui.screens.ArenaRoomScreen
import com.example.ui.screens.ArenaSchoolBattleScreen
import com.example.ui.screens.ArenaShopScreen
import com.example.ui.screens.ArenaTournamentsScreen
import com.example.ui.screens.ArenaVersusIntroScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.viewmodel.ArenaScreen
import com.example.viewmodel.ArenaViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                val viewModel: ArenaViewModel = viewModel()
                val uiState by viewModel.uiState.collectAsStateWithLifecycle()

                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    SmartClassArenaApp(
                        viewModel = viewModel,
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

@Composable
fun SmartClassArenaApp(
    viewModel: ArenaViewModel,
    modifier: Modifier = Modifier
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    when (state.currentScreen) {
        ArenaScreen.LOBBY -> {
            ArenaLobbyScreen(
                state = state,
                onCurriculumChange = { viewModel.selectCurriculum(it) },
                onSubjectChange = { viewModel.selectSubject(it) },
                onModeSelect = { viewModel.startArenaMatch(it) },
                onNavigate = { viewModel.setScreen(it) },
                onRoomCodeChange = { viewModel.setRoomCodeInput(it) },
                onOpenAuthDialog = { viewModel.openAuthDialog() },
                onCloseAuthDialog = { viewModel.closeAuthDialog() },
                onSignIn = { email, pass -> viewModel.signInWithEmail(email, pass) },
                onRegister = { email, pass, name, school, grade, region ->
                    viewModel.registerWithEmail(email, pass, name, school, grade, region)
                },
                onGuestSignIn = { viewModel.signInAsGuest() },
                onSignOut = { viewModel.signOutStudent() },
                onSyncWithCloud = { viewModel.syncProfileWithCloud() },
                onUpdateProfile = { name, school, grade, region ->
                    viewModel.updateStudentProfileDetails(name, school, grade, region)
                },
                onClearAuthMessages = { viewModel.clearAuthMessages() },
                onOpenSyncTracker = { viewModel.openSyncTracker() },
                onCloseSyncTracker = { viewModel.closeSyncTracker() },
                onPingAllChannels = { viewModel.pingAllChannels() },
                onTestChannel = { viewModel.testChannel(it) },
                modifier = modifier
            )
        }
        ArenaScreen.MATCH_INTRO -> {
            ArenaVersusIntroScreen(
                battleState = state.battleState,
                modifier = modifier
            )
        }
        ArenaScreen.BATTLE -> {
            ArenaBattleScreen(
                battleState = state.battleState,
                onOptionSelect = { viewModel.selectOption(it) },
                onUsePowerUp = { viewModel.usePowerUp(it) },
                onForfeit = { viewModel.setScreen(ArenaScreen.LOBBY) },
                modifier = modifier
            )
        }
        ArenaScreen.RESULTS -> {
            ArenaResultScreen(
                battleState = state.battleState,
                onRematch = { viewModel.startArenaMatch(state.battleState.mode) },
                onBackToLobby = { viewModel.setScreen(ArenaScreen.LOBBY) },
                onViewLeaderboard = { viewModel.setScreen(ArenaScreen.LEADERBOARD) },
                onOpenShop = { viewModel.setScreen(ArenaScreen.SHOP) },
                onOpenAchievements = { viewModel.setScreen(ArenaScreen.ACHIEVEMENTS) },
                modifier = modifier
            )
        }
        ArenaScreen.LEADERBOARD -> {
            ArenaLeaderboardScreen(
                state = state,
                onTabSelect = { viewModel.selectLeaderboardTab(it) },
                onBack = { viewModel.setScreen(ArenaScreen.LOBBY) },
                modifier = modifier
            )
        }
        ArenaScreen.SHOP -> {
            ArenaShopScreen(
                userProfile = state.userProfile,
                shopItems = state.shopItems,
                feedbackMessage = state.shopFeedbackMessage,
                onBuyItem = { viewModel.buyShopItem(it) },
                onEquipTitle = { viewModel.equipTitle(it) },
                onEquipAvatar = { viewModel.equipAvatar(it) },
                onBack = { viewModel.setScreen(ArenaScreen.LOBBY) },
                modifier = modifier
            )
        }
        ArenaScreen.ACHIEVEMENTS -> {
            ArenaAchievementsScreen(
                userProfile = state.userProfile,
                achievements = state.achievementsList,
                dailyQuests = state.dailyQuestsList,
                subjectMasteries = state.subjectMasteries,
                feedbackMessage = state.achievementFeedbackMessage,
                onClaimAchievement = { viewModel.claimAchievementReward(it) },
                onClaimQuest = { viewModel.claimDailyQuestReward(it) },
                onPracticeSubject = { viewModel.practiceSubject(it) },
                onBack = { viewModel.setScreen(ArenaScreen.LOBBY) },
                modifier = modifier
            )
        }
        ArenaScreen.ROOM_SETUP -> {
            ArenaRoomScreen(
                state = state,
                onSelectFriend = { viewModel.selectFriend(it) },
                onSearchQueryChange = { viewModel.setFriendSearchQuery(it) },
                onTabChange = { viewModel.setSelectedFriendTab(it) },
                onClassLevelChange = { viewModel.setChallengeClassLevel(it) },
                onSubjectChange = { viewModel.selectSubject(it) },
                onQuestionCountChange = { viewModel.setChallengeQuestionCount(it) },
                onTimeLimitChange = { viewModel.setChallengeTimeLimit(it) },
                onStartFriendChallenge = { viewModel.startFriendChallenge() },
                onRoomCodeChange = { viewModel.setRoomCodeInput(it) },
                onHostRoom = { viewModel.createFriendRoom() },
                onCancelHosting = { viewModel.cancelFriendRoomHosting() },
                onJoinRoom = { viewModel.joinFriendRoom() },
                onBack = {
                    viewModel.cancelFriendRoomHosting()
                    viewModel.setScreen(ArenaScreen.LOBBY)
                },
                modifier = modifier
            )
        }
        ArenaScreen.SCHOOL_BATTLE -> {
            ArenaSchoolBattleScreen(
                state = state,
                onBack = { viewModel.setScreen(ArenaScreen.LOBBY) },
                onSelectRivalSchool = { viewModel.selectRivalSchool(it) },
                onSearchQueryChange = { viewModel.setSchoolSearchQuery(it) },
                onTabSelected = { viewModel.setSelectedSchoolTab(it) },
                onSubjectSelected = { viewModel.selectSubject(it) },
                onStartBattle = { viewModel.startSchoolBattle() }
            )
        }
        ArenaScreen.TOURNAMENTS -> {
            ArenaTournamentsScreen(
                state = state,
                onBack = { viewModel.setScreen(ArenaScreen.LOBBY) },
                onSelectTab = { viewModel.setSelectedTournamentTab(it) },
                onViewBracket = { viewModel.selectTournament(it) },
                onCloseBracket = { viewModel.closeBracketView() },
                onRegister = { viewModel.registerForTournament(it) },
                onEnterMatch = { viewModel.enterTournamentLiveMatch(it) }
            )
        }
    }
}

