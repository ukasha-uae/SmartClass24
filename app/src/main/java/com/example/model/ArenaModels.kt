package com.example.model

enum class ArenaMode(
    val title: String,
    val subtitle: String,
    val iconName: String,
    val badgeText: String,
    val rounds: Int
) {
    QUICK_DUEL(
        title = "1v1 Quick Duel",
        subtitle = "Fast-paced head-to-head match against a live learner or AI",
        iconName = "swords",
        badgeText = "POPULAR",
        rounds = 5
    ),
    BOSS_BATTLE(
        title = "AI Boss Battle",
        subtitle = "Deal damage to educational titans with answer streaks",
        iconName = "robot",
        badgeText = "EPIC REWARDS",
        rounds = 7
    ),
    ROCKET_RACE(
        title = "Rocket Race",
        subtitle = "Fuel your rocket to orbit. First to 100km wins!",
        iconName = "rocket",
        badgeText = "SPEED BOOST",
        rounds = 6
    ),
    SOLO_SPRINT(
        title = "Solo Speed Drill",
        subtitle = "60-second rapid practice with instant AI tutor breakdown",
        iconName = "lightning",
        badgeText = "PRACTICE",
        rounds = 5
    ),
    ROOM_CHALLENGE(
        title = "Challenge Friend",
        subtitle = "Select a friend or classmate to challenge directly or play via match code",
        iconName = "group",
        badgeText = "1v1 FRIEND",
        rounds = 5
    ),
    SCHOOL_BATTLE(
        title = "School Battle",
        subtitle = "Represent your institution and battle rival schools for leaderboard glory",
        iconName = "school",
        badgeText = "SCHOOL GLORY",
        rounds = 5
    ),
    TOURNAMENTS(
        title = "Tournaments",
        subtitle = "Single elimination championships with brackets, prizes, and exclusive rewards",
        iconName = "trophy",
        badgeText = "LIVE CUPS",
        rounds = 5
    )
}

enum class Curriculum(val displayName: String, val shortCode: String, val flag: String) {
    ALL_STEM("All STEM & Science", "STEM", "🔬"),
    S24_INNOVATION_ACADEMY("S24 Innovation Academy", "S24", "🚀"),
    WASSCE_BECE("West Africa (WASSCE / BECE)", "WAEC", "🇬🇭"),
    CAMBRIDGE_IGCSE("Cambridge IGCSE / UK", "IGCSE", "🇬🇧"),
    UAE_MOE("UAE National & International", "UAE", "🇦🇪"),
    COMMON_CORE("US Common Core", "US", "🇺🇸");

    companion object {
        fun fromCode(code: String?): Curriculum {
            if (code == null) return ALL_STEM
            val clean = code.trim().lowercase()
            return when {
                clean.contains("s24") || clean.contains("innovation") || clean.contains("academy") -> S24_INNOVATION_ACADEMY
                clean.contains("cambridge") || clean.contains("igcse") || clean.contains("uk") -> CAMBRIDGE_IGCSE
                clean.contains("uae") || clean.contains("moe") || clean.contains("arabic") -> UAE_MOE
                clean.contains("common") || clean.contains("us") -> COMMON_CORE
                clean.contains("wassce") || clean.contains("waec") || clean.contains("bece") || clean.contains("shs") || clean.contains("jhs") -> WASSCE_BECE
                else -> ALL_STEM
            }
        }
    }
}

enum class Subject(val displayName: String, val iconEmoji: String) {
    ALL("All Subjects", "✨"),
    PYTHON_AI("Python & AI", "🐍"),
    WEB_DEV("Web Development", "🌐"),
    ALGORITHMS("Data Structures & Algorithms", "⚡"),
    CLOUD_CYBER("Cloud & Cybersecurity", "☁️"),
    COMPUTING_AI("Computing & ICT", "💻"),
    MATHEMATICS("Mathematics", "📐"),
    INTEGRATED_SCIENCE("Integrated Science", "🧪"),
    PHYSICS("Physics", "⚡"),
    CHEMISTRY("Chemistry", "⚗️"),
    BIOLOGY("Biology", "🧬"),
    ENGLISH_LOGIC("English & Verbal Logic", "📚"),
    SOCIAL_STUDIES("Social Studies", "🌍");

    companion object {
        fun fromName(name: String?): Subject {
            if (name == null) return ALL
            val clean = name.trim().lowercase()
            return when {
                clean.contains("python") || clean.contains("ai") || clean.contains("machine") -> PYTHON_AI
                clean.contains("web") || clean.contains("html") || clean.contains("css") || clean.contains("javascript") || clean.contains("react") || clean.contains("frontend") -> WEB_DEV
                clean.contains("algo") || clean.contains("structure") || clean.contains("complexity") || clean.contains("tree") || clean.contains("graph") -> ALGORITHMS
                clean.contains("cloud") || clean.contains("cyber") || clean.contains("security") || clean.contains("network") -> CLOUD_CYBER
                clean.contains("comput") || clean.contains("ict") || clean.contains("code") -> COMPUTING_AI
                clean.contains("math") -> MATHEMATICS
                clean.contains("physic") -> PHYSICS
                clean.contains("chem") -> CHEMISTRY
                clean.contains("bio") -> BIOLOGY
                clean.contains("english") || clean.contains("verbal") || clean.contains("literature") -> ENGLISH_LOGIC
                clean.contains("social") || clean.contains("gov") || clean.contains("civic") || clean.contains("hist") || clean.contains("geog") || clean.contains("econ") -> SOCIAL_STUDIES
                clean.contains("sci") -> INTEGRATED_SCIENCE
                else -> ALL
            }
        }
    }
}

data class ArenaQuestion(
    val id: String,
    val subject: Subject,
    val curriculum: Curriculum,
    val questionText: String,
    val options: List<String>,
    val correctIndex: Int,
    val explanation: String,
    val keyConcept: String,
    val difficulty: String = "Medium"
)

data class PowerUp(
    val id: String,
    val name: String,
    val emoji: String,
    val description: String,
    var count: Int
)

data class BossEntity(
    val name: String,
    val title: String,
    val avatarEmoji: String,
    val maxHp: Int = 1000,
    val description: String,
    val specialAttack: String
)

data class LeaderboardUser(
    val rank: Int,
    val name: String,
    val school: String,
    val region: String,
    val regionFlag: String,
    val trophies: Int,
    val winRate: Int,
    val avatarEmoji: String,
    val tier: String,
    val isCurrentUser: Boolean = false
)

data class FriendPlayer(
    val id: String,
    val name: String,
    val school: String,
    val level: String = "SHS",
    val avatarEmoji: String = "👨‍🎓",
    val isOnline: Boolean = true,
    val isBot: Boolean = false,
    val statusText: String = if (isBot) "Always Online" else if (isOnline) "Online" else "Active recently",
    val rating: Int = 1200,
    val winRate: Int = 70,
    val flag: String = "🇬🇭"
)

data class SchoolRanking(
    val school: String,
    val schoolId: String,
    val region: String,
    val country: String,
    val flag: String = "🇬🇭",
    val type: String = "SHS", // "JHS" or "SHS"
    val totalStudents: Int,
    val totalGames: Int,
    val totalWins: Int,
    val points: Int,
    val averageRating: Int,
    val rank: Int,
    val isMySchool: Boolean = false,
    val badgeIcon: String = "🏫"
)

data class TournamentMatch(
    val id: Int,
    val p1: String,
    val p2: String,
    val s1: Int?,
    val s2: Int?,
    val winner: String?,
    val isLive: Boolean = false
)

data class TournamentRound(
    val name: String,
    val matches: List<TournamentMatch>
)

data class TournamentItem(
    val id: String,
    val title: String,
    val subject: String,
    val status: String, // "registering", "active", "completed"
    val startTime: String,
    val participants: Int,
    val maxParticipants: Int,
    val prize: String,
    val iconEmoji: String = "🏆",
    val rounds: List<TournamentRound> = emptyList(),
    val isRegistered: Boolean = false
)

