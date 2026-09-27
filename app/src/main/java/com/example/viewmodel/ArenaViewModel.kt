package com.example.viewmodel

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.ArenaDatabase
import com.example.data.FirebaseManager
import com.example.data.MatchHistoryEntity
import com.example.data.QuestionRepository
import com.example.data.UserProfileEntity
import com.example.model.ArenaMode
import com.example.model.ArenaQuestion
import com.example.model.BossEntity
import com.example.model.Curriculum
import com.example.model.FriendPlayer
import com.example.model.LeaderboardUser
import com.example.model.PowerUp
import com.example.model.SchoolRanking
import com.example.model.Subject
import com.example.model.TournamentItem
import com.example.model.TournamentMatch
import com.example.model.TournamentRound
import com.example.data.SmartClassSyncService
import com.example.model.StudentFirestoreDoc
import com.example.model.ChallengeFirestoreDoc
import com.example.model.SmartClassGameMechanics
import com.example.model.ShopItem
import com.example.model.ShopItemCategory
import com.example.model.AchievementItem
import com.example.model.DailyQuestItem
import com.example.model.SubjectMasteryItem
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlin.random.Random

enum class ArenaScreen {
    LOBBY,
    MATCH_INTRO,
    BATTLE,
    RESULTS,
    LEADERBOARD,
    ROOM_SETUP,
    SCHOOL_BATTLE,
    TOURNAMENTS,
    SHOP,
    ACHIEVEMENTS
}

data class QuestionReview(
    val question: ArenaQuestion,
    val selectedIndex: Int?,
    val isCorrect: Boolean,
    val timeTakenSeconds: Float
)

data class BattleState(
    val mode: ArenaMode = ArenaMode.QUICK_DUEL,
    val subject: Subject = Subject.ALL,
    val curriculum: Curriculum = Curriculum.ALL_STEM,
    val questions: List<ArenaQuestion> = emptyList(),
    val currentQuestionIndex: Int = 0,
    val timeRemaining: Int = 45,
    val maxTimePerQuestion: Int = 45,
    val isTimerActive: Boolean = false,
    val selectedOptionIndex: Int? = null,
    val isAnswerSubmitted: Boolean = false,
    val playerScore: Int = 0,
    val opponentScore: Int = 0,
    val currentStreak: Int = 0,
    val highestMatchStreak: Int = 0,
    val opponentName: String = "Farah K.",
    val opponentSchool: String = "Dubai College",
    val opponentFlag: String = "🇦🇪",
    val opponentAvatarEmoji: String = "👩‍🔬",
    // Boss battle details
    val boss: BossEntity = BossEntity(
        name = "Professor Cyber",
        title = "AI Neural Overlord",
        avatarEmoji = "🤖",
        maxHp = 1000,
        description = "Unleashes rapid algorithmic queries with cybernetic precision.",
        specialAttack = "Logic Overclock"
    ),
    val bossHp: Int = 1000,
    val playerHp: Int = 1000,
    // Rocket race details
    val playerAltitudeKm: Int = 0,
    val opponentAltitudeKm: Int = 0,
    // Power-ups
    val powerUps: List<PowerUp> = listOf(
        PowerUp("5050", "50 / 50", "💡", "Removes 2 incorrect choices", 2),
        PowerUp("freeze", "Time Freeze", "⏱️", "Adds +10s to clock", 1),
        PowerUp("boost", "2x Points", "⚡", "Double score for this question", 1)
    ),
    val eliminatedOptionIndices: Set<Int> = emptySet(),
    val isDoublePointsActive: Boolean = false,
    val isTimeFrozen: Boolean = false,
    val opponentStatusTicker: String = "Waiting for battle start...",
    val reviews: List<QuestionReview> = emptyList(),
    val trophyDelta: Int = 0,
    val roomCode: String = ""
)

data class ArenaUiState(
    val currentScreen: ArenaScreen = ArenaScreen.LOBBY,
    val userProfile: UserProfileEntity = UserProfileEntity(),
    val recentMatches: List<MatchHistoryEntity> = emptyList(),
    val selectedCurriculum: Curriculum = Curriculum.ALL_STEM,
    val selectedSubject: Subject = Subject.ALL,
    val battleState: BattleState = BattleState(),
    val leaderboards: List<LeaderboardUser> = emptyList(),
    val selectedLeaderboardTab: String = "Global", // "Global", "UAE", "West Africa", "Schools"
    val roomCodeInput: String = "",
    val isHostingRoom: Boolean = false,
    val isJoiningRoom: Boolean = false,
    val hostedRoomCode: String = "",
    val roomStatusMessage: String? = null,
    val roomErrorMessage: String? = null,
    // Friend Selection & Challenge state (matching SmartClass24 Web App)
    val friendsList: List<FriendPlayer> = emptyList(),
    val selectedFriendId: String = "bot-sarah",
    val friendSearchQuery: String = "",
    val selectedFriendTab: Int = 0, // 0 = "Select Friend", 1 = "Room Code"
    val selectedChallengeClassLevel: String = "SHS 1",
    val selectedQuestionCount: Int = 5,
    val selectedTimeLimitSeconds: Int = 45,
    val isSendingChallenge: Boolean = false,
    val challengeFeedback: String? = null,
    // School Battle State (SmartClass24 Inter-School Championship)
    val schoolRankings: List<SchoolRanking> = emptyList(),
    val selectedSchoolTab: String = "All", // "All", "Ghana", "UAE", "Nigeria"
    val selectedRivalSchoolId: String = "presec-legon",
    val schoolSearchQuery: String = "",
    val isStartingSchoolBattle: Boolean = false,
    // Tournaments State (SmartClass24 Single Elimination Brackets)
    val tournamentsList: List<TournamentItem> = emptyList(),
    val selectedTournamentTab: String = "upcoming", // "upcoming", "active", "completed"
    val selectedTournamentId: String? = null,
    val isViewingBracket: Boolean = false,
    // Firebase Auth & Cloud Student Profile synchronization state
    val isAuthLoading: Boolean = false,
    val authErrorMessage: String? = null,
    val authSuccessMessage: String? = null,
    val isAuthDialogOpen: Boolean = false,
    val isCloudConnected: Boolean = false,
    val isSyncingProfile: Boolean = false,
    // Shop & Armory
    val shopItems: List<ShopItem> = emptyList(),
    val shopFeedbackMessage: String? = null,
    // Achievements & Quests
    val achievementsList: List<AchievementItem> = emptyList(),
    val dailyQuestsList: List<DailyQuestItem> = emptyList(),
    val subjectMasteries: List<SubjectMasteryItem> = emptyList(),
    val achievementFeedbackMessage: String? = null
)

class ArenaViewModel(application: Application) : AndroidViewModel(application) {

    private val database = ArenaDatabase.getInstance(application)
    private val dao = database.arenaDao()

    private val _uiState = MutableStateFlow(ArenaUiState())
    val uiState: StateFlow<ArenaUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null
    private var opponentJob: Job? = null
    private var roomHostJob: Job? = null
    private var questionStartTime: Long = 0

    init {
        initializeData()
    }

    private fun initializeData() {
        // Initialize authentic question repository from SmartClass24 Web database assets
        QuestionRepository.initialize(getApplication())

        // Sync fresh live questions from Firestore /challenges/
        viewModelScope.launch {
            QuestionRepository.syncFromFirestore()
        }

        // Load or create initial profile
        viewModelScope.launch {
            dao.getUserProfile().collect { profile ->
                if (profile != null) {
                    _uiState.update { it.copy(userProfile = profile) }
                } else {
                    val defaultProfile = UserProfileEntity(
                        name = "Ukasha Al-Mansoor",
                        email = "ukasha.uae@gmail.com",
                        school = "SmartClass International, Dubai",
                        gradeLevel = "SHS 1",
                        selectedRegion = "UAE"
                    )
                    dao.insertOrUpdateProfile(defaultProfile)
                    _uiState.update { it.copy(userProfile = defaultProfile) }
                }
            }
        }

        // Automatic Firebase Student Profile synchronization with smartclass24-5e590
        viewModelScope.launch {
            syncStudentProfileInternal()
        }

        viewModelScope.launch {
            dao.getRecentMatches().collect { matches ->
                _uiState.update {
                    it.copy(
                        recentMatches = matches,
                        subjectMasteries = calculateSubjectMastery(matches)
                    )
                }
            }
        }

        generateLeaderboards()
        loadFriends()
        loadSchoolRankings()
        loadTournaments()
        loadShopCatalog()
        loadAchievementsAndQuests()
    }

    private fun loadFriends() {
        val defaultFriends = listOf(
            FriendPlayer(
                id = "s24-faruq-ai",
                name = "Faruq (S24 AI Fellow) 🚀",
                school = "S24 Innovation Academy",
                level = "AI & ML Track",
                avatarEmoji = "🧑‍💻",
                isOnline = true,
                isBot = false,
                statusText = "Training Neural Networks",
                rating = 1620,
                winRate = 86,
                flag = "🚀"
            ),
            FriendPlayer(
                id = "bot-sarah",
                name = "Sarah (AI Study Partner) 🤖",
                school = "SmartClass AI Academy",
                level = "JHS & SHS",
                avatarEmoji = "👩‍🎓",
                isOnline = true,
                isBot = true,
                statusText = "Always Online",
                rating = 1420,
                winRate = 72,
                flag = "🤖"
            ),
            FriendPlayer(
                id = "friend-kweku",
                name = "Kweku O.",
                school = "Presby Boys (PRESEC), Ghana",
                level = "SHS",
                avatarEmoji = "👨‍💻",
                isOnline = true,
                isBot = false,
                statusText = "Online",
                rating = 1380,
                winRate = 74,
                flag = "🇬🇭"
            ),
            FriendPlayer(
                id = "friend-farah",
                name = "Farah K.",
                school = "Dubai College, UAE",
                level = "SHS",
                avatarEmoji = "👩‍🔬",
                isOnline = true,
                isBot = false,
                statusText = "Online",
                rating = 1410,
                winRate = 76,
                flag = "🇦🇪"
            ),
            FriendPlayer(
                id = "friend-amina",
                name = "Amina M.",
                school = "Achimota School, Ghana",
                level = "SHS",
                avatarEmoji = "👑",
                isOnline = true,
                isBot = false,
                statusText = "Online",
                rating = 1520,
                winRate = 82,
                flag = "🇬🇭"
            ),
            FriendPlayer(
                id = "friend-emeka",
                name = "Emeka N.",
                school = "King's College Lagos, Nigeria",
                level = "SHS",
                avatarEmoji = "⚡",
                isOnline = true,
                isBot = false,
                statusText = "Online",
                rating = 1350,
                winRate = 69,
                flag = "🇳🇬"
            ),
            FriendPlayer(
                id = "friend-zayed",
                name = "Zayed A.",
                school = "GEMS Modern Academy, UAE",
                level = "SHS",
                avatarEmoji = "🚀",
                isOnline = false,
                isBot = false,
                statusText = "Active 10m ago",
                rating = 1460,
                winRate = 78,
                flag = "🇦🇪"
            ),
            FriendPlayer(
                id = "friend-esi",
                name = "Esi M.",
                school = "Wesley Girls' High School, Ghana",
                level = "SHS",
                avatarEmoji = "🌟",
                isOnline = false,
                isBot = false,
                statusText = "Active 25m ago",
                rating = 1330,
                winRate = 68,
                flag = "🇬🇭"
            ),
            FriendPlayer(
                id = "friend-kwame",
                name = "Kwame O.",
                school = "Opoku Ware School (OWASS), Ghana",
                level = "SHS",
                avatarEmoji = "🔥",
                isOnline = false,
                isBot = false,
                statusText = "Active 1h ago",
                rating = 1290,
                winRate = 65,
                flag = "🇬🇭"
            ),
            FriendPlayer(
                id = "friend-fatima",
                name = "Fatima A.",
                school = "Dubai National School, UAE",
                level = "JHS",
                avatarEmoji = "✨",
                isOnline = false,
                isBot = false,
                statusText = "Active 2h ago",
                rating = 1240,
                winRate = 63,
                flag = "🇦🇪"
            ),
            FriendPlayer(
                id = "friend-yaw",
                name = "Yaw A.",
                school = "Prempeh College, Ghana",
                level = "SHS",
                avatarEmoji = "🎯",
                isOnline = false,
                isBot = false,
                statusText = "Active today",
                rating = 1260,
                winRate = 64,
                flag = "🇬🇭"
            )
        )

        _uiState.update { it.copy(friendsList = defaultFriends) }

        // Asynchronously query Firestore `/students` to append real students registered on web app
        viewModelScope.launch {
            val remoteStudents = SmartClassSyncService.fetchFirestoreFriends("student_${_uiState.value.userProfile.id}")
            if (remoteStudents.isNotEmpty()) {
                val combined = (defaultFriends + remoteStudents)
                    .distinctBy { it.name.lowercase().trim() }
                    .sortedWith(compareByDescending<FriendPlayer> { it.isBot }
                        .thenByDescending { it.isOnline }
                        .thenBy { it.name })
                _uiState.update { it.copy(friendsList = combined) }
            }
        }
    }

    fun selectFriend(friendId: String) {
        _uiState.update { it.copy(selectedFriendId = friendId, challengeFeedback = null) }
    }

    fun setFriendSearchQuery(query: String) {
        _uiState.update { it.copy(friendSearchQuery = query) }
    }

    fun setSelectedFriendTab(tab: Int) {
        _uiState.update { it.copy(selectedFriendTab = tab) }
    }

    fun setChallengeClassLevel(level: String) {
        _uiState.update { it.copy(selectedChallengeClassLevel = level) }
    }

    fun setChallengeQuestionCount(count: Int) {
        _uiState.update { it.copy(selectedQuestionCount = count) }
    }

    fun setChallengeTimeLimit(seconds: Int) {
        _uiState.update { it.copy(selectedTimeLimitSeconds = seconds) }
    }

    fun startFriendChallenge() {
        val state = _uiState.value
        val friend = state.friendsList.find { it.id == state.selectedFriendId }
            ?: state.friendsList.firstOrNull() ?: return

        _uiState.update {
            it.copy(
                isSendingChallenge = true,
                challengeFeedback = if (friend.isBot) "Connecting to Sarah..." else "Sending challenge invitation to ${friend.name}..."
            )
        }

        viewModelScope.launch {
            // Register challenge in Firestore /challenges collection
            val challengeDoc = ChallengeFirestoreDoc(
                id = "friend_ch_" + System.currentTimeMillis(),
                type = "friend",
                level = state.selectedChallengeClassLevel,
                subject = state.selectedSubject.displayName,
                difficulty = "medium",
                questionCount = state.selectedQuestionCount,
                timeLimit = state.selectedTimeLimitSeconds,
                creatorId = "student_${state.userProfile.id}",
                creatorName = state.userProfile.name,
                creatorSchool = state.userProfile.school,
                status = if (friend.isBot) "accepted" else "invited",
                opponents = listOf(
                    mapOf(
                        "userId" to friend.id,
                        "userName" to friend.name,
                        "school" to friend.school,
                        "status" to if (friend.isBot) "accepted" else "invited"
                    )
                )
            )
            SmartClassSyncService.createChallengeRoom(challengeDoc)

            if (friend.isBot) {
                delay(700)
                _uiState.update {
                    it.copy(challengeFeedback = "🤖 Sarah Accepted! Starting challenge...")
                }
                delay(600)
                _uiState.update { it.copy(isSendingChallenge = false, challengeFeedback = null) }
                startArenaMatch(
                    mode = ArenaMode.ROOM_CHALLENGE,
                    customOpponent = Triple(friend.name, friend.school, friend.avatarEmoji),
                    customQuestionCount = state.selectedQuestionCount,
                    customTimeLimit = state.selectedTimeLimitSeconds
                )
            } else {
                delay(900)
                _uiState.update {
                    it.copy(challengeFeedback = "🎯 Invitation sent to ${friend.name}! Entering battle arena...")
                }
                delay(600)
                _uiState.update { it.copy(isSendingChallenge = false, challengeFeedback = null) }
                startArenaMatch(
                    mode = ArenaMode.ROOM_CHALLENGE,
                    customOpponent = Triple(friend.name, "${friend.school} ${friend.flag}", friend.avatarEmoji),
                    customQuestionCount = state.selectedQuestionCount,
                    customTimeLimit = state.selectedTimeLimitSeconds
                )
            }
        }
    }

    private fun loadSchoolRankings() {
        val initialRankings = listOf(
            SchoolRanking(
                school = "S24 Innovation Academy",
                schoolId = "s24-innovation-academy",
                region = "Dubai & West Africa",
                country = "Global",
                flag = "🚀",
                type = "STEM",
                totalStudents = 185,
                totalGames = 1680,
                totalWins = 1420,
                points = 24500,
                averageRating = 1780,
                rank = 1,
                badgeIcon = "🚀"
            ),
            SchoolRanking(
                school = "Presbyterian Boys' Sec School (PRESEC)",
                schoolId = "presec-legon",
                region = "Greater Accra",
                country = "Ghana",
                flag = "🇬🇭",
                type = "SHS",
                totalStudents = 142,
                totalGames = 1240,
                totalWins = 960,
                points = 18450,
                averageRating = 1680,
                rank = 2,
                badgeIcon = "🏆"
            ),
            SchoolRanking(
                school = "Dubai College",
                schoolId = "dubai-college",
                region = "Al Sufouh, Dubai",
                country = "UAE",
                flag = "🇦🇪",
                type = "SHS",
                totalStudents = 118,
                totalGames = 1080,
                totalWins = 830,
                points = 16200,
                averageRating = 1640,
                rank = 3,
                badgeIcon = "🥈"
            ),
            SchoolRanking(
                school = "Achimota School",
                schoolId = "achimota-school",
                region = "Greater Accra",
                country = "Ghana",
                flag = "🇬🇭",
                type = "SHS",
                totalStudents = 135,
                totalGames = 1150,
                totalWins = 810,
                points = 15800,
                averageRating = 1610,
                rank = 4,
                badgeIcon = "🥉"
            ),
            SchoolRanking(
                school = "King's College Lagos",
                schoolId = "kings-college-lagos",
                region = "Lagos Island",
                country = "Nigeria",
                flag = "🇳🇬",
                type = "SHS",
                totalStudents = 96,
                totalGames = 940,
                totalWins = 710,
                points = 14200,
                averageRating = 1590,
                rank = 5,
                badgeIcon = "⭐"
            ),
            SchoolRanking(
                school = "GEMS Modern Academy",
                schoolId = "gems-modern",
                region = "Nad Al Sheba, Dubai",
                country = "UAE",
                flag = "🇦🇪",
                type = "SHS",
                totalStudents = 88,
                totalGames = 890,
                totalWins = 670,
                points = 13900,
                averageRating = 1580,
                rank = 6,
                badgeIcon = "🌟"
            ),
            SchoolRanking(
                school = "SmartClass Academy",
                schoolId = "smartclass-academy",
                region = "West Africa / Gulf",
                country = "Ghana",
                flag = "🇬🇭",
                type = "SHS",
                totalStudents = 54,
                totalGames = 480,
                totalWins = 390,
                points = 9800,
                averageRating = 1520,
                rank = 7,
                isMySchool = true,
                badgeIcon = "🏫"
            ),
            SchoolRanking(
                school = "Opoku Ware School (OWASS)",
                schoolId = "opoku-ware",
                region = "Ashanti",
                country = "Ghana",
                flag = "🇬🇭",
                type = "SHS",
                totalStudents = 110,
                totalGames = 920,
                totalWins = 640,
                points = 12900,
                averageRating = 1540,
                rank = 8,
                badgeIcon = "🔥"
            ),
            SchoolRanking(
                school = "Wesley Girls' High School",
                schoolId = "wesley-girls",
                region = "Central",
                country = "Ghana",
                flag = "🇬🇭",
                type = "SHS",
                totalStudents = 105,
                totalGames = 870,
                totalWins = 630,
                points = 12600,
                averageRating = 1550,
                rank = 9,
                badgeIcon = "👑"
            ),
            SchoolRanking(
                school = "Dubai National School",
                schoolId = "dubai-national",
                region = "Al Barsha, Dubai",
                country = "UAE",
                flag = "🇦🇪",
                type = "JHS",
                totalStudents = 76,
                totalGames = 620,
                totalWins = 440,
                points = 8900,
                averageRating = 1490,
                rank = 10,
                badgeIcon = "✨"
            )
        )

        _uiState.update { it.copy(schoolRankings = initialRankings) }
    }

    fun selectRivalSchool(schoolId: String) {
        _uiState.update { it.copy(selectedRivalSchoolId = schoolId) }
    }

    fun setSchoolSearchQuery(query: String) {
        _uiState.update { it.copy(schoolSearchQuery = query) }
    }

    fun setSelectedSchoolTab(tab: String) {
        _uiState.update { it.copy(selectedSchoolTab = tab) }
    }

    fun startSchoolBattle() {
        val state = _uiState.value
        val rivalSchool = state.schoolRankings.find { it.schoolId == state.selectedRivalSchoolId }
            ?: state.schoolRankings.firstOrNull() ?: return

        _uiState.update { it.copy(isStartingSchoolBattle = true) }

        viewModelScope.launch {
            // Register challenge in Firestore /challenges collection
            val challengeDoc = ChallengeFirestoreDoc(
                id = "school_battle_" + System.currentTimeMillis(),
                type = "school",
                level = state.selectedChallengeClassLevel,
                subject = state.selectedSubject.displayName,
                difficulty = "medium",
                questionCount = 5,
                timeLimit = 45,
                creatorId = "student_${state.userProfile.id}",
                creatorName = state.userProfile.name,
                creatorSchool = state.userProfile.school,
                status = "accepted",
                opponents = listOf(
                    mapOf(
                        "userId" to "ai-${rivalSchool.schoolId}",
                        "userName" to "${rivalSchool.school.substringBefore("(").trim()} Champion",
                        "school" to rivalSchool.school,
                        "status" to "accepted"
                    )
                )
            )
            SmartClassSyncService.createChallengeRoom(challengeDoc)

            delay(800)
            _uiState.update { it.copy(isStartingSchoolBattle = false) }

            startArenaMatch(
                mode = ArenaMode.SCHOOL_BATTLE,
                customOpponent = Triple(
                    "${rivalSchool.school.substringBefore("(").trim()} Champion",
                    "${rivalSchool.school} ${rivalSchool.flag}",
                    rivalSchool.badgeIcon
                ),
                customQuestionCount = 5,
                customTimeLimit = 15
            )
        }
    }

    private fun loadTournaments() {
        val scienceCupBracket = listOf(
            TournamentRound(
                name = "Quarter Finals",
                matches = listOf(
                    TournamentMatch(1, "Kwame A.", "Ama O.", 10, 8, "Kwame A."),
                    TournamentMatch(2, "Kofi M.", "Esi B.", 12, 11, "Kofi M."),
                    TournamentMatch(3, "Yaw D.", "Akosua S.", 9, 10, "Akosua S."),
                    TournamentMatch(4, "Kojo F.", "Abena T.", 7, 9, "Abena T.")
                )
            ),
            TournamentRound(
                name = "Semi Finals",
                matches = listOf(
                    TournamentMatch(5, "Kwame A.", "Kofi M.", 11, 9, "Kwame A."),
                    TournamentMatch(6, "Akosua S.", "Abena T.", 8, 10, "Abena T.")
                )
            ),
            TournamentRound(
                name = "Grand Finals",
                matches = listOf(
                    TournamentMatch(7, "Kwame A.", "Abena T.", null, null, null, isLive = true)
                )
            )
        )

        val initialTournaments = listOf(
            TournamentItem(
                id = "t_s24_hackathon",
                title = "S24 Innovation AI Hackathon",
                subject = "Python & AI Systems",
                status = "registering",
                startTime = "Starts this Friday",
                participants = 118,
                maxParticipants = 128,
                prize = "S24 Innovation Fellow + 2500 XP",
                iconEmoji = "🚀",
                isRegistered = false
            ),
            TournamentItem(
                id = "t1",
                title = "Weekly Math Whiz Cup",
                subject = "Mathematics",
                status = "registering",
                startTime = "Starts in 2 days",
                participants = 148,
                maxParticipants = 200,
                prize = "Gold Badge + 500 XP",
                iconEmoji = "🏆",
                isRegistered = false
            ),
            TournamentItem(
                id = "t2",
                title = "Science Super Cup",
                subject = "Integrated Science",
                status = "active",
                startTime = "Live Now",
                participants = 64,
                maxParticipants = 64,
                prize = "Science Master Title",
                iconEmoji = "⭐",
                rounds = scienceCupBracket,
                isRegistered = true
            ),
            TournamentItem(
                id = "t_s24_algo",
                title = "S24 Web & Algo Championship",
                subject = "Web & Algorithms",
                status = "active",
                startTime = "Live Round 2",
                participants = 64,
                maxParticipants = 64,
                prize = "Grand Innovator Trophy",
                iconEmoji = "⚡",
                rounds = scienceCupBracket,
                isRegistered = false
            ),
            TournamentItem(
                id = "t3",
                title = "English Essay & Logic Battle",
                subject = "English Language",
                status = "completed",
                startTime = "Ended yesterday",
                participants = 88,
                maxParticipants = 100,
                prize = "Literary Genius Badge",
                iconEmoji = "📜",
                rounds = listOf(
                    TournamentRound(
                        name = "Finals",
                        matches = listOf(
                            TournamentMatch(101, "Sena K.", "Fatima R.", 15, 12, "Sena K.")
                        )
                    )
                ),
                isRegistered = false
            ),
            TournamentItem(
                id = "t4",
                title = "Computing & AI Championship",
                subject = "Computing & AI",
                status = "registering",
                startTime = "Starts on Saturday",
                participants = 92,
                maxParticipants = 128,
                prize = "Cyber Master Badge + 1000 XP",
                iconEmoji = "💻",
                isRegistered = false
            )
        )

        _uiState.update { it.copy(tournamentsList = initialTournaments) }
    }

    fun setSelectedTournamentTab(tab: String) {
        _uiState.update { it.copy(selectedTournamentTab = tab) }
    }

    fun selectTournament(tournamentId: String) {
        _uiState.update {
            it.copy(
                selectedTournamentId = tournamentId,
                isViewingBracket = true
            )
        }
    }

    fun closeBracketView() {
        _uiState.update { it.copy(isViewingBracket = false) }
    }

    fun registerForTournament(tournamentId: String) {
        _uiState.update { state ->
            val updatedList = state.tournamentsList.map { tournament ->
                if (tournament.id == tournamentId) {
                    tournament.copy(
                        isRegistered = true,
                        participants = tournament.participants + 1
                    )
                } else tournament
            }
            state.copy(tournamentsList = updatedList)
        }

        viewModelScope.launch {
            val profile = _uiState.value.userProfile
            val studentId = profile.firebaseUid ?: FirebaseManager.currentUserId ?: "student_${profile.id}"
            SmartClassSyncService.syncTournamentRegistration(tournamentId, studentId, profile.name)
        }
    }

    fun enterTournamentLiveMatch(tournamentId: String) {
        val tournament = _uiState.value.tournamentsList.find { it.id == tournamentId }
        val opponentName = "Abena T."
        val opponentSchool = "Achimota School 🇬🇭"

        startArenaMatch(
            mode = ArenaMode.TOURNAMENTS,
            customOpponent = Triple(opponentName, opponentSchool, "⭐"),
            customQuestionCount = 5,
            customTimeLimit = 15
        )
    }


    private fun generateLeaderboards() {
        val mockLeaderboard = listOf(
            LeaderboardUser(1, "Faruq B. (S24 Fellow)", "S24 Innovation Academy", "S24 Academy", "🚀", 3120, 95, "🧑‍💻", "Grandmaster"),
            LeaderboardUser(2, "Amina Mensah", "Achimota School", "West Africa", "🇬🇭", 2840, 92, "👑", "Grandmaster"),
            LeaderboardUser(3, "Zayed Al-Hashimi", "GEMS Modern Academy", "UAE", "🇦🇪", 2720, 89, "🚀", "Grandmaster"),
            LeaderboardUser(4, "Ama D. (S24 Innovator)", "S24 Innovation Academy", "S24 Academy", "🚀", 2680, 88, "👩‍💻", "Diamond"),
            LeaderboardUser(5, "Tariq Ibrahim", "King's College Lagos", "West Africa", "🇳🇬", 2650, 87, "⚡", "Diamond"),
            LeaderboardUser(6, "Chloe Davies", "Westminster School", "UK", "🇬🇧", 2510, 85, "🧠", "Diamond"),
            LeaderboardUser(7, "Ukasha Al-Mansoor", "SmartClass International", "UAE", "🇦🇪", 1450, 78, "⭐", "Platinum", isCurrentUser = true),
            LeaderboardUser(8, "Fatima Al-Falasi", "Dubai National School", "UAE", "🇦🇪", 1410, 76, "✨", "Platinum"),
            LeaderboardUser(9, "Kofi Boateng", "PRESEC Legon", "West Africa", "🇬🇭", 1380, 74, "🔥", "Platinum"),
            LeaderboardUser(10, "Liam Chen", "Stuyvesant High", "US", "🇺🇸", 1340, 72, "🎯", "Gold")
        )
        _uiState.update { it.copy(leaderboards = mockLeaderboard) }
    }

    fun setScreen(screen: ArenaScreen) {
        _uiState.update { it.copy(currentScreen = screen) }
    }

    fun selectCurriculum(curriculum: Curriculum) {
        _uiState.update { it.copy(selectedCurriculum = curriculum) }
    }

    fun selectSubject(subject: Subject) {
        _uiState.update { it.copy(selectedSubject = subject) }
    }

    fun selectLeaderboardTab(tab: String) {
        _uiState.update { it.copy(selectedLeaderboardTab = tab) }
    }

    fun setRoomCodeInput(code: String) {
        _uiState.update { it.copy(roomCodeInput = code, roomErrorMessage = null) }
    }

    fun createFriendRoom() {
        val randomCode = "SC-" + Random.nextInt(1000, 9999)
        val profile = _uiState.value.userProfile
        _uiState.update {
            it.copy(
                isHostingRoom = true,
                hostedRoomCode = randomCode,
                roomStatusMessage = "Room created! Share code with your friend. Waiting for them to join...",
                roomErrorMessage = null
            )
        }

        // Broadcast room to Firestore /challenges collection
        viewModelScope.launch {
            val challengeDoc = ChallengeFirestoreDoc(
                id = randomCode,
                type = "room",
                level = "SHS",
                subject = _uiState.value.selectedSubject.displayName,
                creatorId = "student_${profile.id}",
                creatorName = profile.name,
                creatorSchool = profile.school,
                roomCode = randomCode,
                status = "pending"
            )
            SmartClassSyncService.createChallengeRoom(challengeDoc)
        }

        // Simulate opponent joining the custom room in real-time
        roomHostJob?.cancel()
        roomHostJob = viewModelScope.launch {
            delay(2800)
            if (_uiState.value.isHostingRoom) {
                _uiState.update {
                    it.copy(
                        roomStatusMessage = "Peer connected! Launching battle arena..."
                    )
                }
                delay(1200)
                val opponents = listOf(
                    Triple("Tariq I.", "King's College Lagos 🇳🇬", "⚡"),
                    Triple("Amina M.", "Achimota School 🇬🇭", "👑"),
                    Triple("Chloe D.", "Westminster School 🇬🇧", "🧠"),
                    Triple("Farah K.", "Dubai College 🇦🇪", "👩‍🔬")
                )
                val peer = opponents.random()
                startArenaMatch(
                    mode = ArenaMode.ROOM_CHALLENGE,
                    customOpponent = peer,
                    roomCode = randomCode
                )
                _uiState.update { it.copy(isHostingRoom = false, hostedRoomCode = "") }
            }
        }
    }

    fun cancelFriendRoomHosting() {
        roomHostJob?.cancel()
        _uiState.update {
            it.copy(
                isHostingRoom = false,
                hostedRoomCode = "",
                roomStatusMessage = null,
                roomErrorMessage = null
            )
        }
    }

    fun joinFriendRoom() {
        val input = _uiState.value.roomCodeInput.trim().uppercase()
        if (input.isBlank()) {
            _uiState.update { it.copy(roomErrorMessage = "Please enter a valid match code") }
            return
        }

        val formattedCode = if (!input.startsWith("SC-") && input.length == 4 && input.all { it.isDigit() }) {
            "SC-$input"
        } else {
            input
        }

        _uiState.update {
            it.copy(
                isJoiningRoom = true,
                roomErrorMessage = null,
                roomStatusMessage = "Connecting to room $formattedCode..."
            )
        }

        viewModelScope.launch {
            // First attempt to resolve live challenge room from Firestore
            val liveRoom = SmartClassSyncService.findChallengeByRoomCode(formattedCode)
            val hostPlayer = if (liveRoom != null && liveRoom.creatorName.isNotBlank()) {
                Triple(liveRoom.creatorName, "${liveRoom.creatorSchool} 🇦🇪", "🎓")
            } else {
                delay(1200)
                val opponents = listOf(
                    Triple("Zayed Al-Hashimi", "GEMS Modern Academy 🇦🇪", "🚀"),
                    Triple("Kofi Boateng", "PRESEC Legon 🇬🇭", "🔥"),
                    Triple("Liam Chen", "Stuyvesant High 🇺🇸", "🎯"),
                    Triple("Fatima Al-Falasi", "Dubai National School 🇦🇪", "✨")
                )
                opponents.random()
            }

            _uiState.update {
                it.copy(
                    isJoiningRoom = false,
                    roomStatusMessage = "Connected to host ${hostPlayer.first}!"
                )
            }
            delay(800)
            startArenaMatch(
                mode = ArenaMode.ROOM_CHALLENGE,
                customOpponent = hostPlayer,
                roomCode = formattedCode,
                customQuestionCount = liveRoom?.questionCount ?: 5,
                customTimeLimit = liveRoom?.timeLimit ?: 45
            )
        }
    }

    fun startArenaMatch(
        mode: ArenaMode,
        customOpponent: Triple<String, String, String>? = null,
        roomCode: String = "",
        customQuestionCount: Int? = null,
        customTimeLimit: Int? = null
    ) {
        val count = customQuestionCount ?: mode.rounds
        val timeLimit = customTimeLimit ?: when (mode) {
            ArenaMode.BOSS_BATTLE -> 60
            ArenaMode.ROCKET_RACE -> 60
            ArenaMode.SOLO_SPRINT -> 60
            ArenaMode.TOURNAMENTS -> 60
            ArenaMode.SCHOOL_BATTLE -> 45
            ArenaMode.QUICK_DUEL -> 45
            ArenaMode.ROOM_CHALLENGE -> _uiState.value.selectedTimeLimitSeconds.takeIf { it > 0 } ?: 45
        }
        val questions = QuestionRepository.getQuestionsForBattle(
            subject = _uiState.value.selectedSubject,
            curriculum = _uiState.value.selectedCurriculum,
            count = count
        )

        val opponentData = customOpponent ?: when (mode) {
            ArenaMode.BOSS_BATTLE -> Triple("Professor Cyber", "AI Neural Overlord", "🤖")
            ArenaMode.ROCKET_RACE -> Triple("Astra Rival", "Space Academy, Ghana 🇬🇭", "🚀")
            ArenaMode.ROOM_CHALLENGE -> Triple("Room Guest", "Peer Match", "🎮")
            else -> {
                val opponents = listOf(
                    Triple("Faruq (S24 AI Fellow) 🚀", "S24 Innovation Academy 🚀", "🧑‍💻"),
                    Triple("Sarah (AI Study Partner) 🤖", "SmartClass AI Academy", "👩‍🎓"),
                    Triple("Farah K.", "Dubai College, UAE 🇦🇪", "👩‍🔬"),
                    Triple("Kweku O.", "Presby Boys (PRESEC), Ghana 🇬🇭", "👨‍💻"),
                    Triple("Ama (S24 FullStack) 💻", "S24 Innovation Academy 🚀", "👩‍💻"),
                    Triple("Emeka N.", "King's College, Nigeria 🇳🇬", "⚡"),
                    Triple("Amina M.", "Achimota School, Ghana 🇬🇭", "👑")
                )
                opponents.random()
            }
        }

        val finalRoomCode = if (roomCode.isNotBlank()) roomCode else if (mode == ArenaMode.ROOM_CHALLENGE) {
            "SC-" + Random.nextInt(1000, 9999)
        } else ""

        val profile = _uiState.value.userProfile
        val battlePowerUps = listOf(
            PowerUp("5050", "50 / 50", "💡", "Removes 2 incorrect choices", profile.powerUpFiftyFifty),
            PowerUp("freeze", "Time Freeze", "⏱️", "Adds +10s to clock", profile.powerUpFreeze),
            PowerUp("boost", "2x Points", "⚡", "Double score for this question", profile.powerUpBoost),
            PowerUp("shield", "Aegis Shield", "🛡️", "Blocks 1 penalty or boss attack", profile.powerUpShield)
        )

        val initialBattleState = BattleState(
            mode = mode,
            subject = _uiState.value.selectedSubject,
            curriculum = _uiState.value.selectedCurriculum,
            questions = questions,
            currentQuestionIndex = 0,
            timeRemaining = timeLimit,
            maxTimePerQuestion = timeLimit,
            isTimerActive = false,
            selectedOptionIndex = null,
            isAnswerSubmitted = false,
            playerScore = 0,
            opponentScore = 0,
            currentStreak = 0,
            highestMatchStreak = 0,
            opponentName = opponentData.first,
            opponentSchool = opponentData.second,
            opponentAvatarEmoji = opponentData.third,
            bossHp = 1000,
            playerHp = 1000,
            playerAltitudeKm = 0,
            opponentAltitudeKm = 0,
            powerUps = battlePowerUps,
            eliminatedOptionIndices = emptySet(),
            isDoublePointsActive = false,
            isTimeFrozen = false,
            opponentStatusTicker = "Match starting in arena...",
            reviews = emptyList(),
            roomCode = finalRoomCode
        )

        _uiState.update {
            it.copy(
                battleState = initialBattleState,
                currentScreen = ArenaScreen.MATCH_INTRO
            )
        }

        // Versus screen countdown then start question
        viewModelScope.launch {
            delay(1800)
            _uiState.update { it.copy(currentScreen = ArenaScreen.BATTLE) }
            startQuestionTurn()
        }
    }

    private fun startQuestionTurn() {
        val currentQ = _uiState.value.battleState.questions.getOrNull(_uiState.value.battleState.currentQuestionIndex) ?: return
        questionStartTime = System.currentTimeMillis()

        _uiState.update { state ->
            state.copy(
                battleState = state.battleState.copy(
                    timeRemaining = state.battleState.maxTimePerQuestion,
                    maxTimePerQuestion = state.battleState.maxTimePerQuestion,
                    isTimerActive = true,
                    selectedOptionIndex = null,
                    isAnswerSubmitted = false,
                    eliminatedOptionIndices = emptySet(),
                    isDoublePointsActive = false,
                    isTimeFrozen = false,
                    opponentStatusTicker = "Opponent is reading question..."
                )
            )
        }

        startTimer()
        simulateOpponentTurn(currentQ)
    }

    private fun startTimer() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (true) {
                delay(1000)
                val current = _uiState.value.battleState
                if (!current.isTimerActive || current.isAnswerSubmitted) break

                if (current.isTimeFrozen) {
                    continue
                }

                if (current.timeRemaining <= 1) {
                    // Time out
                    _uiState.update {
                        it.copy(
                            battleState = it.battleState.copy(
                                timeRemaining = 0,
                                isTimerActive = false
                            )
                        )
                    }
                    submitAnswer(null)
                    break
                } else {
                    _uiState.update {
                        it.copy(
                            battleState = it.battleState.copy(
                                timeRemaining = it.battleState.timeRemaining - 1
                            )
                        )
                    }
                }
            }
        }
    }

    private fun simulateOpponentTurn(question: ArenaQuestion) {
        opponentJob?.cancel()
        opponentJob = viewModelScope.launch {
            val isBoss = _uiState.value.battleState.mode == ArenaMode.BOSS_BATTLE
            val current = _uiState.value.battleState
            val isSarahBot = current.opponentName.contains("Sarah")

            // Web-aligned response delay (Sarah thinks for 2500-4200ms)
            val opponentAnswerTime = if (isSarahBot) {
                Random.nextLong(2500, 4200)
            } else if (isBoss) {
                Random.nextLong(3000, 7000)
            } else {
                Random.nextLong(3000, 8500)
            }
            delay(opponentAnswerTime)

            // Web-aligned accuracy (Sarah has adaptive 70% accuracy)
            val opponentWillBeCorrect = if (isSarahBot) {
                // Adaptive: if player is dominating, Sarah steps up slightly
                val playerAdvantage = current.playerScore > current.opponentScore
                val accuracy = if (playerAdvantage) 0.78f else 0.68f
                Random.nextFloat() < accuracy
            } else if (isBoss) {
                Random.nextFloat() < 0.85f
            } else {
                Random.nextFloat() < 0.70f
            }

            if (isBoss) {
                if (opponentWillBeCorrect) {
                    val damage = Random.nextInt(120, 200)
                    _uiState.update {
                        it.copy(
                            battleState = it.battleState.copy(
                                playerHp = (it.battleState.playerHp - damage).coerceAtLeast(0),
                                opponentScore = it.battleState.opponentScore + damage,
                                opponentStatusTicker = "💥 ${current.boss.name} casts ${current.boss.specialAttack}! (-$damage HP)"
                            )
                        )
                    }
                } else {
                    _uiState.update {
                        it.copy(
                            battleState = it.battleState.copy(
                                opponentStatusTicker = "🛡️ ${current.boss.name}'s calculation glitched! Shield down!"
                            )
                        )
                    }
                }
            } else if (current.mode == ArenaMode.ROCKET_RACE) {
                if (opponentWillBeCorrect) {
                    val km = Random.nextInt(15, 25)
                    _uiState.update {
                        it.copy(
                            battleState = it.battleState.copy(
                                opponentAltitudeKm = (it.battleState.opponentAltitudeKm + km).coerceAtMost(100),
                                opponentScore = it.battleState.opponentScore + 100,
                                opponentStatusTicker = "🚀 Rival boosted +$km km!"
                            )
                        )
                    }
                }
            } else {
                if (opponentWillBeCorrect) {
                    val scoreGain = 100 + Random.nextInt(20, 50)
                    _uiState.update {
                        it.copy(
                            battleState = it.battleState.copy(
                                opponentScore = it.battleState.opponentScore + scoreGain,
                                opponentStatusTicker = "${current.opponentName} answered correctly! (+${scoreGain} pts)"
                            )
                        )
                    }
                } else {
                    _uiState.update {
                        it.copy(
                            battleState = it.battleState.copy(
                                opponentStatusTicker = "${current.opponentName} answered incorrectly!"
                            )
                        )
                    }
                }
            }
        }
    }

    fun selectOption(optionIndex: Int) {
        if (_uiState.value.battleState.isAnswerSubmitted) return
        submitAnswer(optionIndex)
    }

    private fun submitAnswer(selectedIndex: Int?) {
        val state = _uiState.value.battleState
        if (state.isAnswerSubmitted) return

        timerJob?.cancel()
        val currentQ = state.questions.getOrNull(state.currentQuestionIndex) ?: return
        val isCorrect = selectedIndex != null && selectedIndex == currentQ.correctIndex
        val timeSpent = ((System.currentTimeMillis() - questionStartTime) / 1000f).coerceAtLeast(0.5f)

        // Points calculation
        val basePoints = if (isCorrect) 100 else 0
        val speedBonus = if (isCorrect) (state.timeRemaining * 10) else 0
        val streakBonus = if (isCorrect) (state.currentStreak * 25) else 0
        val multiplier = if (state.isDoublePointsActive) 2 else 1
        val pointsWon = (basePoints + speedBonus + streakBonus) * multiplier

        val newStreak = if (isCorrect) state.currentStreak + 1 else 0
        val highestStreak = maxOf(state.highestMatchStreak, newStreak)

        val newPlayerScore = state.playerScore + pointsWon

        // Boss damage calculation
        val newBossHp = if (state.mode == ArenaMode.BOSS_BATTLE && isCorrect) {
            (state.bossHp - (pointsWon * 1.5f).toInt()).coerceAtLeast(0)
        } else state.bossHp

        // Rocket race altitude
        val newPlayerAltitude = if (state.mode == ArenaMode.ROCKET_RACE && isCorrect) {
            (state.playerAltitudeKm + 20).coerceAtMost(100)
        } else state.playerAltitudeKm

        val review = QuestionReview(
            question = currentQ,
            selectedIndex = selectedIndex,
            isCorrect = isCorrect,
            timeTakenSeconds = timeSpent
        )

        _uiState.update {
            it.copy(
                battleState = it.battleState.copy(
                    isAnswerSubmitted = true,
                    isTimerActive = false,
                    selectedOptionIndex = selectedIndex,
                    playerScore = newPlayerScore,
                    currentStreak = newStreak,
                    highestMatchStreak = highestStreak,
                    bossHp = newBossHp,
                    playerAltitudeKm = newPlayerAltitude,
                    reviews = it.battleState.reviews + review
                )
            )
        }

        // Advance question or finish battle after brief feedback reveal
        viewModelScope.launch {
            delay(1600)
            val nextIndex = _uiState.value.battleState.currentQuestionIndex + 1
            if (nextIndex < _uiState.value.battleState.questions.size) {
                _uiState.update {
                    it.copy(
                        battleState = it.battleState.copy(
                            currentQuestionIndex = nextIndex
                        )
                    )
                }
                startQuestionTurn()
            } else {
                finishBattle()
            }
        }
    }

    fun usePowerUp(powerUpId: String) {
        val state = _uiState.value.battleState
        if (state.isAnswerSubmitted) return

        val powerUp = state.powerUps.find { it.id == powerUpId && it.count > 0 } ?: return
        val currentQ = state.questions.getOrNull(state.currentQuestionIndex) ?: return

        when (powerUpId) {
            "5050" -> {
                if (state.eliminatedOptionIndices.isEmpty()) {
                    val incorrectIndices = currentQ.options.indices.filter { it != currentQ.correctIndex }.shuffled()
                    val toEliminate = incorrectIndices.take(2).toSet()
                    _uiState.update {
                        it.copy(
                            battleState = it.battleState.copy(
                                eliminatedOptionIndices = toEliminate,
                                powerUps = it.battleState.powerUps.map { p ->
                                    if (p.id == powerUpId) p.copy(count = p.count - 1) else p
                                }
                            )
                        )
                    }
                }
            }
            "freeze" -> {
                _uiState.update {
                    it.copy(
                        battleState = it.battleState.copy(
                            timeRemaining = it.battleState.timeRemaining + 10,
                            isTimeFrozen = true,
                            powerUps = it.battleState.powerUps.map { p ->
                                if (p.id == powerUpId) p.copy(count = p.count - 1) else p
                            }
                        )
                    )
                }
            }
            "boost" -> {
                _uiState.update {
                    it.copy(
                        battleState = it.battleState.copy(
                            isDoublePointsActive = true,
                            powerUps = it.battleState.powerUps.map { p ->
                                if (p.id == powerUpId) p.copy(count = p.count - 1) else p
                            }
                        )
                    )
                }
            }
            "shield" -> {
                _uiState.update {
                    it.copy(
                        battleState = it.battleState.copy(
                            opponentStatusTicker = "🛡️ Aegis Shield active! Protected against damage!",
                            powerUps = it.battleState.powerUps.map { p ->
                                if (p.id == powerUpId) p.copy(count = p.count - 1) else p
                            }
                        )
                    )
                }
            }
        }

        // Synchronize power-up inventory deduction to local Room profile
        viewModelScope.launch {
            val prof = _uiState.value.userProfile
            val updated = when (powerUpId) {
                "5050" -> prof.copy(powerUpFiftyFifty = (prof.powerUpFiftyFifty - 1).coerceAtLeast(0))
                "freeze" -> prof.copy(powerUpFreeze = (prof.powerUpFreeze - 1).coerceAtLeast(0))
                "boost" -> prof.copy(powerUpBoost = (prof.powerUpBoost - 1).coerceAtLeast(0))
                "shield" -> prof.copy(powerUpShield = (prof.powerUpShield - 1).coerceAtLeast(0))
                else -> prof
            }
            dao.insertOrUpdateProfile(updated)
            _uiState.update { it.copy(userProfile = updated) }
        }
    }

    private fun finishBattle() {
        timerJob?.cancel()
        opponentJob?.cancel()

        val state = _uiState.value.battleState
        val isVictory = when (state.mode) {
            ArenaMode.BOSS_BATTLE -> state.bossHp <= 0 || state.playerScore >= state.opponentScore
            ArenaMode.ROCKET_RACE -> state.playerAltitudeKm >= state.opponentAltitudeKm
            else -> state.playerScore >= state.opponentScore
        }

        val trophyGain = if (isVictory) 25 + (state.highestMatchStreak * 2) else -10
        val correctCount = state.reviews.count { it.isCorrect }
        val accuracy = if (state.questions.isNotEmpty()) {
            (correctCount * 100) / state.questions.size
        } else 0

        _uiState.update {
            it.copy(
                battleState = it.battleState.copy(
                    trophyDelta = trophyGain
                ),
                currentScreen = ArenaScreen.RESULTS
            )
        }

        // Persist to Room database
        viewModelScope.launch {
            val currentProfile = _uiState.value.userProfile
            val updatedTrophies = (currentProfile.trophies + trophyGain).coerceAtLeast(0)
            val updatedVictories = if (isVictory) currentProfile.victories + 1 else currentProfile.victories
            val updatedMatches = currentProfile.totalMatches + 1
            val updatedHighestStreak = maxOf(currentProfile.highestStreak, state.highestMatchStreak)
            val xpGained = state.playerScore / 2
            val updatedXp = currentProfile.xp + xpGained
            val updatedLevel = (updatedXp / 300) + 1

            val coinsEarned = SmartClassGameMechanics.calculateMatchCoins(if (isVictory) "VICTORY" else "DEFEAT")
            val updatedCoins = currentProfile.coins + coinsEarned

            val updatedProfile = currentProfile.copy(
                trophies = updatedTrophies,
                totalMatches = updatedMatches,
                victories = updatedVictories,
                highestStreak = updatedHighestStreak,
                currentStreak = if (isVictory) currentProfile.currentStreak + 1 else 0,
                coins = updatedCoins,
                xp = updatedXp,
                level = updatedLevel
            )

            dao.insertOrUpdateProfile(updatedProfile)

            val matchRecord = MatchHistoryEntity(
                mode = state.mode.title,
                opponentName = if (state.mode == ArenaMode.BOSS_BATTLE) state.boss.name else state.opponentName,
                subject = state.subject.displayName,
                result = if (isVictory) "VICTORY" else "DEFEAT",
                playerScore = state.playerScore,
                opponentScore = state.opponentScore,
                trophyDelta = trophyGain,
                accuracyPercent = accuracy,
                streak = state.highestMatchStreak
            )
            dao.insertMatchHistory(matchRecord)
            updateAchievementsAfterBattle(state, isVictory, updatedProfile)

            // Asynchronously sync student profile update to Firestore /students/ collection
            val studentId = currentProfile.firebaseUid ?: FirebaseManager.currentUserId ?: "student_${currentProfile.id}"
            val studentDoc = StudentFirestoreDoc(
                id = studentId,
                userName = currentProfile.name,
                email = currentProfile.email ?: FirebaseManager.currentUserEmail,
                school = currentProfile.school,
                schoolRegion = currentProfile.selectedRegion,
                gradeLevel = currentProfile.gradeLevel,
                rating = updatedTrophies,
                xp = updatedXp,
                coins = currentProfile.coins + SmartClassGameMechanics.calculateMatchCoins(if (isVictory) "VICTORY" else "DEFEAT"),
                wins = updatedVictories,
                losses = if (!isVictory) (currentProfile.totalMatches - currentProfile.victories + 1) else (currentProfile.totalMatches - currentProfile.victories),
                totalGames = updatedMatches,
                winStreak = if (isVictory) currentProfile.currentStreak + 1 else 0,
                highestStreak = updatedHighestStreak
            )
            SmartClassSyncService.updateStudentProfile(studentDoc)

            // Asynchronously sync school points to Firestore /schools/ collection
            SmartClassSyncService.syncSchoolPoints(
                schoolName = currentProfile.school,
                pointsGained = trophyGain.coerceAtLeast(0),
                wonMatch = isVictory
            )
        }
    }

    /**
     * Internal routine to sync local profile with remote Firestore `/students/` collection.
     */
    private suspend fun syncStudentProfileInternal(): Boolean {
        _uiState.update { it.copy(isSyncingProfile = true) }
        return try {
            val isFirebaseReady = FirebaseManager.isFirebaseInitialized()
            _uiState.update { it.copy(isCloudConnected = isFirebaseReady) }
            if (!isFirebaseReady) {
                _uiState.update { it.copy(isSyncingProfile = false) }
                return false
            }

            val currentUser = FirebaseManager.currentUser
            val localProfile = _uiState.value.userProfile

            // If user is not authenticated with Firebase Auth, do not attempt to read the
            // protected /students collection in Firestore (which requires request.auth != null).
            if (currentUser == null) {
                _uiState.update { it.copy(isSyncingProfile = false) }
                return false
            }

            val remoteDoc: StudentFirestoreDoc? = SmartClassSyncService.getOrSyncCurrentStudent(
                defaultName = localProfile.name,
                defaultSchool = localProfile.school,
                defaultGrade = localProfile.gradeLevel
            )

            if (remoteDoc != null) {
                val syncedProfile = localProfile.copy(
                    firebaseUid = currentUser?.uid ?: remoteDoc.id,
                    email = remoteDoc.email ?: currentUser?.email ?: localProfile.email,
                    name = remoteDoc.userName.ifBlank { localProfile.name },
                    school = remoteDoc.school.ifBlank { localProfile.school },
                    gradeLevel = remoteDoc.gradeLevel.ifBlank { localProfile.gradeLevel },
                    selectedRegion = remoteDoc.schoolRegion.ifBlank { localProfile.selectedRegion },
                    trophies = if (remoteDoc.rating > 0) remoteDoc.rating else localProfile.trophies,
                    xp = if (remoteDoc.xp > 0) remoteDoc.xp else localProfile.xp,
                    coins = if (remoteDoc.coins > 0) remoteDoc.coins else localProfile.coins,
                    victories = if (remoteDoc.wins > 0) remoteDoc.wins else localProfile.victories,
                    totalMatches = if (remoteDoc.totalGames > 0) remoteDoc.totalGames else localProfile.totalMatches,
                    currentStreak = if (remoteDoc.winStreak > 0) remoteDoc.winStreak else localProfile.currentStreak,
                    highestStreak = if (remoteDoc.highestStreak > 0) remoteDoc.highestStreak else localProfile.highestStreak,
                    isCloudSynced = true
                )
                dao.insertOrUpdateProfile(syncedProfile)
                _uiState.update { it.copy(userProfile = syncedProfile, isSyncingProfile = false, isCloudConnected = true) }
                true
            } else {
                _uiState.update { it.copy(isSyncingProfile = false) }
                false
            }
        } catch (e: Exception) {
            Log.w("ArenaViewModel", "Failed to sync student profile: ${e.message}")
            _uiState.update { it.copy(isSyncingProfile = false) }
            false
        }
    }

    fun openAuthDialog() {
        _uiState.update { it.copy(isAuthDialogOpen = true, authErrorMessage = null, authSuccessMessage = null) }
    }

    fun closeAuthDialog() {
        _uiState.update { it.copy(isAuthDialogOpen = false, authErrorMessage = null, authSuccessMessage = null) }
    }

    fun clearAuthMessages() {
        _uiState.update { it.copy(authErrorMessage = null, authSuccessMessage = null) }
    }

    fun signInWithEmail(email: String, password: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isAuthLoading = true, authErrorMessage = null, authSuccessMessage = null) }
            val result = SmartClassSyncService.signInWithEmail(email, password)
            result.onSuccess { doc ->
                val current = _uiState.value.userProfile
                val updated = current.copy(
                    firebaseUid = doc.id,
                    email = doc.email ?: email,
                    name = doc.userName.ifBlank { current.name },
                    school = doc.school.ifBlank { current.school },
                    gradeLevel = doc.gradeLevel.ifBlank { current.gradeLevel },
                    selectedRegion = doc.schoolRegion.ifBlank { current.selectedRegion },
                    trophies = if (doc.rating > 0) doc.rating else current.trophies,
                    xp = if (doc.xp > 0) doc.xp else current.xp,
                    coins = if (doc.coins > 0) doc.coins else current.coins,
                    victories = if (doc.wins > 0) doc.wins else current.victories,
                    totalMatches = if (doc.totalGames > 0) doc.totalGames else current.totalMatches,
                    isCloudSynced = true
                )
                dao.insertOrUpdateProfile(updated)
                _uiState.update {
                    it.copy(
                        userProfile = updated,
                        isAuthLoading = false,
                        authSuccessMessage = "Welcome back, ${doc.userName}! Synced with SmartClass24 Web.",
                        isCloudConnected = true
                    )
                }
            }.onFailure { err ->
                _uiState.update {
                    it.copy(
                        isAuthLoading = false,
                        authErrorMessage = err.localizedMessage ?: "Sign-in failed. Please check your credentials."
                    )
                }
            }
        }
    }

    fun registerWithEmail(
        email: String,
        password: String,
        name: String,
        school: String,
        gradeLevel: String,
        region: String
    ) {
        viewModelScope.launch {
            _uiState.update { it.copy(isAuthLoading = true, authErrorMessage = null, authSuccessMessage = null) }
            val result = SmartClassSyncService.registerWithEmail(email, password, name, school, gradeLevel, region)
            result.onSuccess { doc ->
                val current = _uiState.value.userProfile
                val updated = current.copy(
                    firebaseUid = doc.id,
                    email = doc.email ?: email,
                    name = doc.userName,
                    school = doc.school,
                    gradeLevel = doc.gradeLevel,
                    selectedRegion = doc.schoolRegion,
                    trophies = doc.rating,
                    xp = doc.xp,
                    coins = doc.coins,
                    isCloudSynced = true
                )
                dao.insertOrUpdateProfile(updated)
                _uiState.update {
                    it.copy(
                        userProfile = updated,
                        isAuthLoading = false,
                        authSuccessMessage = "Account created successfully!",
                        isCloudConnected = true
                    )
                }
            }.onFailure { err ->
                _uiState.update {
                    it.copy(
                        isAuthLoading = false,
                        authErrorMessage = err.localizedMessage ?: "Registration failed."
                    )
                }
            }
        }
    }

    fun signInAsGuest() {
        viewModelScope.launch {
            _uiState.update { it.copy(isAuthLoading = true, authErrorMessage = null, authSuccessMessage = null) }
            val result = SmartClassSyncService.signInAnonymously()
            result.onSuccess { doc ->
                val current = _uiState.value.userProfile
                val updated = current.copy(
                    firebaseUid = doc.id,
                    isCloudSynced = true
                )
                dao.insertOrUpdateProfile(updated)
                _uiState.update {
                    it.copy(
                        userProfile = updated,
                        isAuthLoading = false,
                        authSuccessMessage = "Guest profile connected to SmartClass24 Arena.",
                        isCloudConnected = true
                    )
                }
            }.onFailure { err ->
                _uiState.update {
                    it.copy(
                        isAuthLoading = false,
                        authErrorMessage = err.localizedMessage ?: "Guest sign-in failed."
                    )
                }
            }
        }
    }

    fun signOutStudent() {
        SmartClassSyncService.signOut()
        viewModelScope.launch {
            val current = _uiState.value.userProfile
            val updated = current.copy(
                firebaseUid = null,
                isCloudSynced = false
            )
            dao.insertOrUpdateProfile(updated)
            _uiState.update {
                it.copy(
                    userProfile = updated,
                    authSuccessMessage = "Signed out. Playing in offline mode."
                )
            }
        }
    }

    fun syncProfileWithCloud() {
        viewModelScope.launch {
            if (FirebaseManager.currentUser == null) {
                _uiState.update {
                    it.copy(
                        authErrorMessage = "Please sign in or continue as Guest in the Auth menu to sync your profile with SmartClass24 Cloud."
                    )
                }
                return@launch
            }
            val synced = syncStudentProfileInternal()
            if (synced) {
                _uiState.update { it.copy(authSuccessMessage = "Profile successfully refreshed from SmartClass24 Web!") }
            } else {
                _uiState.update { it.copy(authErrorMessage = "Could not sync with cloud. Check internet connection.") }
            }
        }
    }

    fun updateStudentProfileDetails(name: String, school: String, gradeLevel: String, region: String) {
        val current = _uiState.value.userProfile
        val updated = current.copy(
            name = name.ifBlank { current.name },
            school = school.ifBlank { current.school },
            gradeLevel = gradeLevel.ifBlank { current.gradeLevel },
            selectedRegion = region.ifBlank { current.selectedRegion }
        )
        _uiState.update { it.copy(userProfile = updated) }

        viewModelScope.launch {
            dao.insertOrUpdateProfile(updated)

            // Push to Firestore only if user is authenticated
            val uid = updated.firebaseUid ?: FirebaseManager.currentUserId
            if (!uid.isNullOrBlank() && FirebaseManager.currentUser != null) {
                val isS24 = updated.school.contains("Innovation", ignoreCase = true) ||
                        updated.school.contains("S24", ignoreCase = true) ||
                        updated.selectedCurriculum.contains("INNOVATION", ignoreCase = true) ||
                        updated.selectedCurriculum.contains("S24", ignoreCase = true)
                val doc = StudentFirestoreDoc(
                    id = uid,
                    tenantId = if (isS24) "s24-innovation" else "default",
                    curriculumId = if (isS24) "s24-innovation-academy" else "west-african",
                    userName = updated.name,
                    email = updated.email,
                    school = updated.school,
                    schoolRegion = updated.selectedRegion,
                    gradeLevel = updated.gradeLevel,
                    rating = updated.trophies,
                    xp = updated.xp,
                    coins = updated.coins,
                    wins = updated.victories,
                    totalGames = updated.totalMatches,
                    winStreak = updated.currentStreak,
                    highestStreak = updated.highestStreak
                )
                SmartClassSyncService.updateStudentProfile(doc)
            }
        }
    }

    // ==========================================
    // SHOP & POWER-UP ARMORY LOGIC
    // ==========================================

    fun loadShopCatalog() {
        val items = listOf(
            // Power-ups
            ShopItem(
                id = "pu_5050",
                name = "50/50 Lifeline Pack",
                description = "Removes 2 incorrect choices instantly in battle",
                category = ShopItemCategory.POWER_UP,
                priceCoins = 50,
                iconEmoji = "💡",
                quantityPerPurchase = 3,
                badgeTag = "POPULAR"
            ),
            ShopItem(
                id = "pu_freeze",
                name = "Time Freeze Booster",
                description = "Freezes countdown and adds +10s to thinking time",
                category = ShopItemCategory.POWER_UP,
                priceCoins = 60,
                iconEmoji = "⏱️",
                quantityPerPurchase = 2
            ),
            ShopItem(
                id = "pu_boost",
                name = "2x Points Multiplier",
                description = "Doubles all points earned on the next question",
                category = ShopItemCategory.POWER_UP,
                priceCoins = 75,
                iconEmoji = "⚡",
                quantityPerPurchase = 2,
                badgeTag = "HIGH SCORE"
            ),
            ShopItem(
                id = "pu_shield",
                name = "Aegis Defense Shield",
                description = "Blocks 1 penalty or AI boss special attack damage",
                category = ShopItemCategory.POWER_UP,
                priceCoins = 90,
                iconEmoji = "🛡️",
                quantityPerPurchase = 1,
                badgeTag = "DEFENSE"
            ),
            // Titles
            ShopItem(
                id = "title_s24_fellow",
                name = "S24 AI Fellow",
                description = "Elite researcher and AI practitioner from S24 Innovation Academy",
                category = ShopItemCategory.TITLE,
                priceCoins = 120,
                iconEmoji = "🚀",
                badgeTag = "ELITE"
            ),
            ShopItem(
                id = "title_fullstack",
                name = "FullStack Architect",
                description = "Modern web systems & algorithmic architect",
                category = ShopItemCategory.TITLE,
                priceCoins = 150,
                iconEmoji = "💻"
            ),
            ShopItem(
                id = "title_math_titan",
                name = "Math Olympiad Titan",
                description = "Master of complex calculus, algebra, and geometry",
                category = ShopItemCategory.TITLE,
                priceCoins = 100,
                iconEmoji = "📐"
            ),
            ShopItem(
                id = "title_neural_strategist",
                name = "Neural Strategist",
                description = "Boss combat specialist with high answer speed",
                category = ShopItemCategory.TITLE,
                priceCoins = 140,
                iconEmoji = "🤖"
            ),
            ShopItem(
                id = "title_speed_prodigy",
                name = "Speed Prodigy",
                description = "Sub-5 second solver across all STEM subjects",
                category = ShopItemCategory.TITLE,
                priceCoins = 90,
                iconEmoji = "⚡"
            ),
            ShopItem(
                id = "title_grandmaster",
                name = "Arena Grandmaster",
                description = "Legendary competitor dominating regional leaderboards",
                category = ShopItemCategory.TITLE,
                priceCoins = 250,
                iconEmoji = "👑",
                badgeTag = "LEGEND"
            ),
            // Avatars
            ShopItem(
                id = "avatar_classic",
                name = "Classic Scholar",
                description = "Dedicated learner representing academic excellence",
                category = ShopItemCategory.AVATAR,
                priceCoins = 0,
                iconEmoji = "👨‍🎓"
            ),
            ShopItem(
                id = "avatar_cyber_bot",
                name = "Cyber Neural Bot",
                description = "Futuristic AI student with neural overclock",
                category = ShopItemCategory.AVATAR,
                priceCoins = 80,
                iconEmoji = "🤖",
                badgeTag = "POPULAR"
            ),
            ShopItem(
                id = "avatar_rocket",
                name = "Falcon Starship",
                description = "Speed racer pioneering the cosmic frontier",
                category = ShopItemCategory.AVATAR,
                priceCoins = 80,
                iconEmoji = "🚀"
            ),
            ShopItem(
                id = "avatar_coder",
                name = "Innovation Coder",
                description = "S24 Innovation Academy coding champion",
                category = ShopItemCategory.AVATAR,
                priceCoins = 80,
                iconEmoji = "👩‍💻"
            ),
            ShopItem(
                id = "avatar_sage",
                name = "Algorithm Sage",
                description = "Wise master of trees, graphs, and dynamic programming",
                category = ShopItemCategory.AVATAR,
                priceCoins = 100,
                iconEmoji = "🧙‍♂️"
            ),
            ShopItem(
                id = "avatar_lion",
                name = "Black Star Lion",
                description = "Proud symbol of West African academic strength",
                category = ShopItemCategory.AVATAR,
                priceCoins = 90,
                iconEmoji = "🦁"
            ),
            ShopItem(
                id = "avatar_falcon",
                name = "Golden Desert Falcon",
                description = "UAE international competitor with sharp intellect",
                category = ShopItemCategory.AVATAR,
                priceCoins = 90,
                iconEmoji = "🦅"
            ),
            ShopItem(
                id = "avatar_scientist",
                name = "Quantum Physicist",
                description = "Explorer of subatomic particles and energy equations",
                category = ShopItemCategory.AVATAR,
                priceCoins = 80,
                iconEmoji = "👩‍🔬"
            )
        )
        _uiState.update { it.copy(shopItems = items) }
    }

    fun buyShopItem(itemId: String) {
        val item = _uiState.value.shopItems.find { it.id == itemId } ?: return
        val currentProfile = _uiState.value.userProfile
        if (currentProfile.coins < item.priceCoins) {
            _uiState.update { it.copy(shopFeedbackMessage = "Not enough coins! You need ${item.priceCoins} 💰") }
            return
        }

        viewModelScope.launch {
            val updatedCoins = currentProfile.coins - item.priceCoins
            val updatedProfile = when (item.id) {
                "pu_5050" -> currentProfile.copy(
                    coins = updatedCoins,
                    powerUpFiftyFifty = currentProfile.powerUpFiftyFifty + item.quantityPerPurchase
                )
                "pu_freeze" -> currentProfile.copy(
                    coins = updatedCoins,
                    powerUpFreeze = currentProfile.powerUpFreeze + item.quantityPerPurchase
                )
                "pu_boost" -> currentProfile.copy(
                    coins = updatedCoins,
                    powerUpBoost = currentProfile.powerUpBoost + item.quantityPerPurchase
                )
                "pu_shield" -> currentProfile.copy(
                    coins = updatedCoins,
                    powerUpShield = currentProfile.powerUpShield + item.quantityPerPurchase
                )
                else -> when (item.category) {
                    ShopItemCategory.TITLE -> {
                        val currentTitles = currentProfile.unlockedTitles.split(",").map { it.trim() }.toMutableSet()
                        currentTitles.add(item.name)
                        currentProfile.copy(
                            coins = updatedCoins,
                            title = item.name,
                            unlockedTitles = currentTitles.joinToString(",")
                        )
                    }
                    ShopItemCategory.AVATAR -> {
                        val currentAvatars = currentProfile.unlockedAvatars.split(",").map { it.trim() }.toMutableSet()
                        currentAvatars.add(item.iconEmoji)
                        currentProfile.copy(
                            coins = updatedCoins,
                            avatarEmoji = item.iconEmoji,
                            unlockedAvatars = currentAvatars.joinToString(",")
                        )
                    }
                    else -> currentProfile.copy(coins = updatedCoins)
                }
            }

            dao.insertOrUpdateProfile(updatedProfile)
            _uiState.update {
                it.copy(
                    userProfile = updatedProfile,
                    shopFeedbackMessage = "Purchased ${item.name}! (-${item.priceCoins} 💰)"
                )
            }
        }
    }

    fun equipTitle(title: String) {
        viewModelScope.launch {
            val updated = _uiState.value.userProfile.copy(title = title)
            dao.insertOrUpdateProfile(updated)
            _uiState.update {
                it.copy(
                    userProfile = updated,
                    shopFeedbackMessage = "Equipped title: \"$title\"!"
                )
            }
        }
    }

    fun equipAvatar(avatarEmoji: String) {
        viewModelScope.launch {
            val updated = _uiState.value.userProfile.copy(avatarEmoji = avatarEmoji)
            dao.insertOrUpdateProfile(updated)
            _uiState.update {
                it.copy(
                    userProfile = updated,
                    shopFeedbackMessage = "Equipped avatar: $avatarEmoji!"
                )
            }
        }
    }

    // ==========================================
    // ACHIEVEMENTS, QUESTS & MASTERY LOGIC
    // ==========================================

    fun loadAchievementsAndQuests() {
        val profile = _uiState.value.userProfile
        val defaultAchievements = listOf(
            AchievementItem(
                id = "s24_pioneer",
                title = "S24 Innovation Pioneer",
                description = "Compete in Python & AI or Web Dev subject tracks",
                iconEmoji = "🚀",
                category = "S24 Academy",
                currentProgress = 3,
                targetProgress = 3,
                isUnlocked = true,
                isClaimed = false,
                rewardCoins = 50,
                rewardXp = 100
            ),
            AchievementItem(
                id = "boss_slayer",
                title = "Neural Overlord Slayer",
                description = "Defeat AI Boss Professor Cyber in battle",
                iconEmoji = "🤖",
                category = "Combat",
                currentProgress = 1,
                targetProgress = 1,
                isUnlocked = true,
                isClaimed = false,
                rewardCoins = 60,
                rewardXp = 150
            ),
            AchievementItem(
                id = "speed_demon",
                title = "Speed Demon",
                description = "Answer 5 questions under 5 seconds each",
                iconEmoji = "⚡",
                category = "Speed",
                currentProgress = 4,
                targetProgress = 5,
                isUnlocked = false,
                isClaimed = false,
                rewardCoins = 40,
                rewardXp = 80
            ),
            AchievementItem(
                id = "streak_master",
                title = "Unstoppable Streak",
                description = "Achieve a 5-question answer streak",
                iconEmoji = "🔥",
                category = "Combat",
                currentProgress = profile.highestStreak,
                targetProgress = 5,
                isUnlocked = profile.highestStreak >= 5,
                isClaimed = false,
                rewardCoins = 50,
                rewardXp = 100
            ),
            AchievementItem(
                id = "school_pride",
                title = "Campus Champion",
                description = "Represent your school in Inter-School Championship",
                iconEmoji = "🏫",
                category = "Championship",
                currentProgress = 1,
                targetProgress = 1,
                isUnlocked = true,
                isClaimed = false,
                rewardCoins = 45,
                rewardXp = 90
            ),
            AchievementItem(
                id = "tournament_cup",
                title = "Tournament Gladiator",
                description = "Compete in a tournament knockout bracket",
                iconEmoji = "🏆",
                category = "Championship",
                currentProgress = 1,
                targetProgress = 1,
                isUnlocked = true,
                isClaimed = false,
                rewardCoins = 55,
                rewardXp = 120
            ),
            AchievementItem(
                id = "coin_collector",
                title = "Treasure Hoarder",
                description = "Accumulate 300+ total arena coins",
                iconEmoji = "💰",
                category = "Mastery",
                currentProgress = profile.coins,
                targetProgress = 300,
                isUnlocked = profile.coins >= 300,
                isClaimed = false,
                rewardCoins = 50,
                rewardXp = 100
            ),
            AchievementItem(
                id = "polymath",
                title = "Polymath Scholar",
                description = "Complete battles in 3 different academic subjects",
                iconEmoji = "📚",
                category = "Mastery",
                currentProgress = 3,
                targetProgress = 3,
                isUnlocked = true,
                isClaimed = false,
                rewardCoins = 40,
                rewardXp = 80
            )
        )

        val defaultQuests = listOf(
            DailyQuestItem(
                id = "quest_win_match",
                title = "Daily Triumph",
                description = "Win at least 1 match in any arena mode",
                iconEmoji = "🏆",
                currentProgress = 1,
                targetProgress = 1,
                isCompleted = true,
                isClaimed = false,
                rewardCoins = 25,
                rewardXp = 50
            ),
            DailyQuestItem(
                id = "quest_s24_stem",
                title = "Tech & Science Drill",
                description = "Complete 1 battle in Python & AI or STEM subjects",
                iconEmoji = "🔬",
                currentProgress = 1,
                targetProgress = 1,
                isCompleted = true,
                isClaimed = false,
                rewardCoins = 25,
                rewardXp = 50
            ),
            DailyQuestItem(
                id = "quest_use_powerup",
                title = "Tactical Maneuver",
                description = "Deploy a power-up in battle (50/50, Freeze, or Boost)",
                iconEmoji = "💡",
                currentProgress = 1,
                targetProgress = 1,
                isCompleted = true,
                isClaimed = false,
                rewardCoins = 20,
                rewardXp = 40
            )
        )

        _uiState.update {
            it.copy(
                achievementsList = defaultAchievements,
                dailyQuestsList = defaultQuests
            )
        }
    }

    fun claimAchievementReward(achievementId: String) {
        val achievement = _uiState.value.achievementsList.find { it.id == achievementId } ?: return
        if (achievement.isClaimed || achievement.currentProgress < achievement.targetProgress) return

        viewModelScope.launch {
            val profile = _uiState.value.userProfile
            val updated = profile.copy(
                coins = profile.coins + achievement.rewardCoins,
                xp = profile.xp + achievement.rewardXp,
                level = ((profile.xp + achievement.rewardXp) / 300) + 1
            )
            dao.insertOrUpdateProfile(updated)

            _uiState.update { state ->
                state.copy(
                    userProfile = updated,
                    achievementsList = state.achievementsList.map {
                        if (it.id == achievementId) it.copy(isClaimed = true) else it
                    },
                    achievementFeedbackMessage = "Claimed reward: +${achievement.rewardCoins} 💰 and +${achievement.rewardXp} XP!"
                )
            }
        }
    }

    fun claimDailyQuestReward(questId: String) {
        val quest = _uiState.value.dailyQuestsList.find { it.id == questId } ?: return
        if (quest.isClaimed || quest.currentProgress < quest.targetProgress) return

        viewModelScope.launch {
            val profile = _uiState.value.userProfile
            val updated = profile.copy(
                coins = profile.coins + quest.rewardCoins,
                xp = profile.xp + quest.rewardXp,
                level = ((profile.xp + quest.rewardXp) / 300) + 1
            )
            dao.insertOrUpdateProfile(updated)

            _uiState.update { state ->
                state.copy(
                    userProfile = updated,
                    dailyQuestsList = state.dailyQuestsList.map {
                        if (it.id == questId) it.copy(isClaimed = true) else it
                    },
                    achievementFeedbackMessage = "Quest completed! +${quest.rewardCoins} 💰 and +${quest.rewardXp} XP!"
                )
            }
        }
    }

    private fun updateAchievementsAfterBattle(state: BattleState, isVictory: Boolean, profile: UserProfileEntity) {
        val currentAchievements = _uiState.value.achievementsList.map { ach ->
            when (ach.id) {
                "s24_pioneer" -> {
                    val isS24 = state.curriculum == Curriculum.S24_INNOVATION_ACADEMY ||
                            state.subject in listOf(Subject.PYTHON_AI, Subject.WEB_DEV, Subject.ALGORITHMS, Subject.CLOUD_CYBER)
                    if (isS24) {
                        val prog = (ach.currentProgress + 1).coerceAtMost(ach.targetProgress)
                        ach.copy(currentProgress = prog, isUnlocked = prog >= ach.targetProgress)
                    } else ach
                }
                "boss_slayer" -> {
                    if (state.mode == ArenaMode.BOSS_BATTLE && isVictory) {
                        ach.copy(currentProgress = 1, isUnlocked = true)
                    } else ach
                }
                "streak_master" -> {
                    val prog = maxOf(ach.currentProgress, state.highestMatchStreak).coerceAtMost(ach.targetProgress)
                    ach.copy(currentProgress = prog, isUnlocked = prog >= ach.targetProgress)
                }
                "school_pride" -> {
                    if (state.mode == ArenaMode.SCHOOL_BATTLE) {
                        ach.copy(currentProgress = 1, isUnlocked = true)
                    } else ach
                }
                "tournament_cup" -> {
                    if (state.mode == ArenaMode.TOURNAMENTS) {
                        ach.copy(currentProgress = 1, isUnlocked = true)
                    } else ach
                }
                "coin_collector" -> {
                    val prog = profile.coins.coerceAtMost(ach.targetProgress)
                    ach.copy(currentProgress = prog, isUnlocked = prog >= ach.targetProgress)
                }
                else -> ach
            }
        }

        val currentQuests = _uiState.value.dailyQuestsList.map { quest ->
            when (quest.id) {
                "quest_win_match" -> if (isVictory) quest.copy(currentProgress = 1, isCompleted = true) else quest
                "quest_s24_stem" -> quest.copy(currentProgress = 1, isCompleted = true)
                else -> quest
            }
        }

        _uiState.update {
            it.copy(
                achievementsList = currentAchievements,
                dailyQuestsList = currentQuests
            )
        }
    }

    private fun calculateSubjectMastery(matches: List<MatchHistoryEntity>): List<SubjectMasteryItem> {
        val trackedSubjects = listOf(
            Subject.PYTHON_AI,
            Subject.WEB_DEV,
            Subject.ALGORITHMS,
            Subject.MATHEMATICS,
            Subject.INTEGRATED_SCIENCE,
            Subject.PHYSICS
        )

        return trackedSubjects.map { subject ->
            val subjectMatches = matches.filter { it.subject.contains(subject.displayName, ignoreCase = true) }
            val count = subjectMatches.size.coerceAtLeast(1)
            val avgAcc = if (subjectMatches.isNotEmpty()) {
                subjectMatches.sumOf { it.accuracyPercent } / subjectMatches.size
            } else {
                when (subject) {
                    Subject.PYTHON_AI -> 88
                    Subject.WEB_DEV -> 82
                    Subject.ALGORITHMS -> 75
                    Subject.MATHEMATICS -> 90
                    Subject.INTEGRATED_SCIENCE -> 84
                    Subject.PHYSICS -> 78
                    else -> 70
                }
            }
            val level = when {
                avgAcc >= 85 -> "Master 🏆"
                avgAcc >= 70 -> "Scholar 🎓"
                else -> "Apprentice 📖"
            }
            SubjectMasteryItem(
                subject = subject,
                gamesPlayed = maxOf(subjectMatches.size, when (subject) {
                    Subject.PYTHON_AI -> 14
                    Subject.MATHEMATICS -> 12
                    Subject.WEB_DEV -> 8
                    Subject.INTEGRATED_SCIENCE -> 9
                    else -> 5
                }),
                correctAnswers = (avgAcc * 5 / 100 * maxOf(count, 5)),
                totalAnswers = (5 * maxOf(count, 5)),
                accuracyPercent = avgAcc,
                masteryLevel = level
            )
        }
    }

    fun practiceSubject(subject: Subject) {
        selectSubject(subject)
        startArenaMatch(ArenaMode.SOLO_SPRINT)
    }
}
