package com.example.model

data class AchievementItem(
    val id: String,
    val title: String,
    val description: String,
    val iconEmoji: String,
    val category: String, // "S24 Academy", "Arena Battle", "Speed & Streaks", "Mastery"
    val currentProgress: Int,
    val targetProgress: Int,
    val isUnlocked: Boolean,
    val isClaimed: Boolean,
    val rewardCoins: Int,
    val rewardXp: Int
)

data class DailyQuestItem(
    val id: String,
    val title: String,
    val description: String,
    val iconEmoji: String,
    val currentProgress: Int,
    val targetProgress: Int,
    val isCompleted: Boolean,
    val isClaimed: Boolean,
    val rewardCoins: Int,
    val rewardXp: Int
)

data class SubjectMasteryItem(
    val subject: Subject,
    val gamesPlayed: Int,
    val correctAnswers: Int,
    val totalAnswers: Int,
    val accuracyPercent: Int,
    val masteryLevel: String, // "Novice", "Scholar", "Master", "Grandmaster"
    val statusColorHex: Long = 0xFF10B981
)
