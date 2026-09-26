package com.example.model

/**
 * Game mechanics matching SmartClass24 Web's gamification.ts & bot-ai-engine.ts.
 */
object SmartClassGameMechanics {

    /**
     * Exact XP calculation logic from SmartClass24 Web:
     * - Base XP: 20 per correct answer
     * - Time Bonus: up to 10 XP if answered quickly (< 50% of time limit)
     * - Streak Bonus: 5 XP per streak count
     */
    fun calculateQuestionXP(
        isCorrect: Boolean,
        timeTakenSeconds: Float,
        timeLimitSeconds: Int = 45,
        streak: Int = 0
    ): Int {
        if (!isCorrect) return 0
        var xp = 20
        // Quick answer bonus
        if (timeTakenSeconds < (timeLimitSeconds / 2f)) {
            val speedBonus = ((1f - (timeTakenSeconds / (timeLimitSeconds / 2f))) * 10).toInt()
            xp += speedBonus.coerceIn(0, 10)
        }
        // Streak bonus
        xp += (streak * 5).coerceAtMost(30)
        return xp
    }

    /**
     * Coins award formula:
     * - Match victory: 25 coins
     * - Draw: 10 coins
     * - Completion/Practice: 5 coins
     */
    fun calculateMatchCoins(result: String): Int {
        return when (result.uppercase()) {
            "VICTORY" -> 25
            "DRAW" -> 10
            else -> 5
        }
    }

    /**
     * ELO trophy delta formula matching Web Arena
     */
    fun calculateTrophyDelta(playerWon: Boolean, streak: Int): Int {
        return if (playerWon) {
            25 + (streak * 2).coerceAtMost(10)
        } else {
            -15
        }
    }
}
