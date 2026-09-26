package com.example.data

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "user_profile")
data class UserProfileEntity(
    @PrimaryKey val id: Int = 1,
    val firebaseUid: String? = null,
    val email: String? = "ukasha.uae@gmail.com",
    val name: String = "Ukasha Al-Mansoor",
    val title: String = "Arena Challenger",
    val school: String = "SmartClass International, Dubai",
    val gradeLevel: String = "SHS 1",
    val avatarEmoji: String = "👨‍🎓",
    val selectedCurriculum: String = "ALL_STEM",
    val selectedRegion: String = "UAE",
    val trophies: Int = 1450,
    val level: Int = 12,
    val xp: Int = 3420,
    val coins: Int = 250,
    val totalMatches: Int = 48,
    val victories: Int = 36,
    val highestStreak: Int = 8,
    val currentStreak: Int = 4,
    val isCloudSynced: Boolean = false,
    val powerUpFiftyFifty: Int = 3,
    val powerUpFreeze: Int = 2,
    val powerUpBoost: Int = 2,
    val powerUpShield: Int = 1,
    val unlockedTitles: String = "Arena Challenger,AI Fellow,Code Apprentice",
    val unlockedAvatars: String = "👨‍🎓,🧑‍💻,👩‍🔬,🌟"
)

@Entity(tableName = "match_history")
data class MatchHistoryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val timestamp: Long = System.currentTimeMillis(),
    val mode: String,
    val opponentName: String,
    val subject: String,
    val result: String, // VICTORY, DEFEAT, COMPLETED
    val playerScore: Int,
    val opponentScore: Int,
    val trophyDelta: Int,
    val accuracyPercent: Int,
    val streak: Int
)

@Entity(tableName = "achievements")
data class AchievementEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val iconEmoji: String,
    val category: String,
    val currentProgress: Int,
    val targetProgress: Int,
    val isUnlocked: Boolean = false,
    val isClaimed: Boolean = false,
    val rewardCoins: Int = 50,
    val rewardXp: Int = 100
)

@Entity(tableName = "daily_quests")
data class DailyQuestEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val iconEmoji: String,
    val currentProgress: Int,
    val targetProgress: Int,
    val isCompleted: Boolean = false,
    val isClaimed: Boolean = false,
    val rewardCoins: Int = 25,
    val rewardXp: Int = 50
)

@Dao
interface ArenaDao {
    @Query("SELECT * FROM user_profile WHERE id = 1")
    fun getUserProfile(): Flow<UserProfileEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateProfile(profile: UserProfileEntity)

    @Update
    suspend fun updateProfile(profile: UserProfileEntity)

    @Query("SELECT * FROM match_history ORDER BY timestamp DESC LIMIT 20")
    fun getRecentMatches(): Flow<List<MatchHistoryEntity>>

    @Insert
    suspend fun insertMatchHistory(match: MatchHistoryEntity)

    @Query("SELECT * FROM achievements")
    fun getAllAchievements(): Flow<List<AchievementEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAchievements(list: List<AchievementEntity>)

    @Update
    suspend fun updateAchievement(item: AchievementEntity)

    @Query("SELECT * FROM daily_quests")
    fun getAllDailyQuests(): Flow<List<DailyQuestEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDailyQuests(list: List<DailyQuestEntity>)

    @Update
    suspend fun updateDailyQuest(quest: DailyQuestEntity)
}

@Database(
    entities = [
        UserProfileEntity::class,
        MatchHistoryEntity::class,
        AchievementEntity::class,
        DailyQuestEntity::class
    ],
    version = 4,
    exportSchema = false
)
abstract class ArenaDatabase : RoomDatabase() {
    abstract fun arenaDao(): ArenaDao

    companion object {
        @Volatile
        private var INSTANCE: ArenaDatabase? = null

        fun getInstance(context: Context): ArenaDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ArenaDatabase::class.java,
                    "smartclass_arena.db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
