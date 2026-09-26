package com.example.model

/**
 * Shared data structures representing the exact Firebase Firestore models
 * used by the SmartClass24 Web Application (smartclass24-5e590).
 */

/**
 * Direct mapping of Firestore `/students/{studentId}` document.
 */
data class StudentFirestoreDoc(
    val id: String = "",
    val tenantId: String = "default",
    val curriculumId: String = "west-african",
    val userName: String = "",
    val email: String? = null,
    val school: String = "",
    val schoolId: String? = null,
    val schoolRegion: String = "",
    val gradeLevel: String = "SHS 1",
    val avatar: String = "👨‍🎓",
    val rating: Int = 1200,
    val xp: Int = 0,
    val coins: Int = 100,
    val wins: Int = 0,
    val losses: Int = 0,
    val draws: Int = 0,
    val totalGames: Int = 0,
    val winStreak: Int = 0,
    val highestStreak: Int = 0,
    val isVerified: Boolean = false,
    val isOnline: Boolean = true,
    val lastActive: Long = System.currentTimeMillis()
)

/**
 * Direct mapping of Firestore `/challenges/{challengeId}` document
 * used by SmartClass24 Web's Challenge Arena.
 */
data class ChallengeFirestoreDoc(
    val id: String = "",
    val type: String = "quick", // "quick", "room", "boss", "school"
    val level: String = "SHS",  // "JHS" or "SHS"
    val subject: String = "Mathematics",
    val difficulty: String = "medium",
    val questionCount: Int = 5,
    val timeLimit: Int = 45,
    val creatorId: String = "",
    val creatorName: String = "",
    val creatorSchool: String = "",
    val roomCode: String? = null,
    val status: String = "pending", // "pending", "accepted", "in-progress", "completed"
    val opponents: List<Map<String, Any>> = emptyList(),
    val questions: List<Map<String, Any>> = emptyList(),
    val winner: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

/**
 * Direct mapping of Firestore `/subscriptions/{userId}` document.
 */
data class UserSubscriptionDoc(
    val userId: String = "",
    val tier: String = "free", // "free", "premium", "virtual_lab", "full_bundle"
    val isActive: Boolean = true,
    val features: List<String> = listOf("challenge_arena"),
    val planId: String? = null
)
