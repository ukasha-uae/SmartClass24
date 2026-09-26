package com.example.data

import android.util.Log
import com.example.model.ArenaQuestion
import com.example.model.ChallengeFirestoreDoc
import com.example.model.Curriculum
import com.example.model.FriendPlayer
import com.example.model.StudentFirestoreDoc
import com.example.model.Subject
import com.example.model.UserSubscriptionDoc
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ListenerRegistration
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

/**
 * Service managing real-time synchronisation with the production SmartClass24
 * Firebase project (smartclass24-5e590).
 */
object SmartClassSyncService {

    private const val TAG = "SmartClassSyncService"
    private const val STUDENTS_COLLECTION = "students"
    private const val CHALLENGES_COLLECTION = "challenges"
    private const val SUBSCRIPTIONS_COLLECTION = "subscriptions"

    /**
     * Parses a Firestore DocumentSnapshot into StudentFirestoreDoc, supporting
     * flexible field names used across Web and Mobile.
     */
    fun parseStudentDoc(doc: DocumentSnapshot): StudentFirestoreDoc {
        val name = doc.getString("userName")
            ?: doc.getString("studentName")
            ?: doc.getString("displayName")
            ?: doc.getString("name")
            ?: "Student"

        val school = doc.getString("school")
            ?: doc.getString("schoolName")
            ?: "SmartClass Academy"

        val gradeLevel = doc.getString("gradeLevel")
            ?: doc.getString("studentClass")
            ?: doc.getString("classLevel")
            ?: "SHS 1"

        val rating = (doc.getLong("rating") ?: doc.getLong("elo") ?: doc.getLong("trophies"))?.toInt() ?: 1200
        val xp = (doc.getLong("xp") ?: doc.getLong("points"))?.toInt() ?: 0
        val coins = doc.getLong("coins")?.toInt() ?: 100
        val wins = (doc.getLong("wins") ?: doc.getLong("victories"))?.toInt() ?: 0
        val losses = doc.getLong("losses")?.toInt() ?: 0
        val draws = doc.getLong("draws")?.toInt() ?: 0
        val totalGames = (doc.getLong("totalGames") ?: doc.getLong("totalMatches"))?.toInt() ?: (wins + losses + draws)
        val winStreak = (doc.getLong("winStreak") ?: doc.getLong("streak"))?.toInt() ?: 0
        val highestStreak = doc.getLong("highestStreak")?.toInt() ?: winStreak
        val isOnline = doc.getBoolean("isOnline") ?: (doc.get("lastActive") != null || doc.get("lastSeen") != null)

        return StudentFirestoreDoc(
            id = doc.id,
            tenantId = doc.getString("tenantId") ?: "default",
            curriculumId = doc.getString("curriculumId") ?: "west-african",
            userName = name,
            email = doc.getString("email"),
            school = school,
            schoolId = doc.getString("schoolId"),
            schoolRegion = doc.getString("schoolRegion") ?: doc.getString("region") ?: "Greater Accra",
            gradeLevel = gradeLevel,
            avatar = doc.getString("avatar") ?: if (name.endsWith("a") || name.endsWith("i")) "👩‍🎓" else "👨‍🎓",
            rating = rating,
            xp = xp,
            coins = coins,
            wins = wins,
            losses = losses,
            draws = draws,
            totalGames = totalGames,
            winStreak = winStreak,
            highestStreak = highestStreak,
            isVerified = doc.getBoolean("isVerified") ?: false,
            isOnline = isOnline,
            lastActive = doc.getLong("lastActive") ?: System.currentTimeMillis()
        )
    }

    /**
     * Fetch student profile by UID from Firestore.
     */
    suspend fun getStudentProfile(uid: String): StudentFirestoreDoc? {
        val firestore = FirebaseManager.getFirestore() ?: return null
        if (FirebaseManager.currentUser == null) {
            Log.d(TAG, "getStudentProfile skipped: Active Firebase authentication required to read /students")
            return null
        }
        return try {
            val doc = firestore.collection(STUDENTS_COLLECTION).document(uid).get().await()
            if (doc.exists()) {
                parseStudentDoc(doc)
            } else null
        } catch (e: Exception) {
            if (e.message?.contains("PERMISSION_DENIED") == true) {
                Log.w(TAG, "Student profile access restricted by security rules for uid: $uid")
            } else {
                Log.e(TAG, "Error fetching student profile: ${e.message}")
            }
            null
        }
    }

    /**
     * Finds a student profile by email address from the Web `/students` collection.
     */
    suspend fun findStudentByEmail(email: String): StudentFirestoreDoc? {
        val firestore = FirebaseManager.getFirestore() ?: return null
        if (FirebaseManager.currentUser == null) {
            Log.d(TAG, "findStudentByEmail skipped: Active Firebase authentication required to read /students")
            return null
        }
        return try {
            val snapshot = firestore.collection(STUDENTS_COLLECTION)
                .whereEqualTo("email", email.trim().lowercase())
                .limit(1)
                .get()
                .await()

            if (!snapshot.isEmpty) {
                parseStudentDoc(snapshot.documents[0])
            } else null
        } catch (e: Exception) {
            if (e.message?.contains("PERMISSION_DENIED") == true) {
                Log.w(TAG, "Query student by email restricted by security rules: ${e.message}")
            } else {
                Log.e(TAG, "Error querying student by email: ${e.message}")
            }
            null
        }
    }

    /**
     * Resolves the student document for the active Firebase user.
     * Looks up by user.uid, then by user.email. If absent, provisions a new record.
     */
    suspend fun getOrSyncCurrentStudent(
        defaultName: String = "Student",
        defaultSchool: String = "SmartClass Academy",
        defaultGrade: String = "SHS 1"
    ): StudentFirestoreDoc? {
        val user = FirebaseManager.currentUser ?: return null
        val firestore = FirebaseManager.getFirestore() ?: return null

        // 1. Try UID document
        val byUid = getStudentProfile(user.uid)
        if (byUid != null) return byUid

        // 2. Try email document
        val email = user.email
        if (!email.isNullOrBlank()) {
            val byEmail = findStudentByEmail(email)
            if (byEmail != null) return byEmail
        }

        // 3. Document does not exist yet; initialize student record in Firestore
        val initialName = user.displayName?.takeIf { it.isNotBlank() }
            ?: email?.substringBefore("@")?.replace(".", " ")?.capitalizeWords()
            ?: defaultName

        val newDoc = StudentFirestoreDoc(
            id = user.uid,
            userName = initialName,
            email = email,
            school = defaultSchool,
            gradeLevel = defaultGrade,
            rating = 1200,
            xp = 100,
            coins = 150,
            isOnline = true
        )
        updateStudentProfile(newDoc)
        return newDoc
    }

    private fun String.capitalizeWords(): String = split(" ").joinToString(" ") { word ->
        word.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
    }

    /**
     * Signs in with email and password via Firebase Authentication,
     * then resolves and synchronizes their Web student profile.
     */
    suspend fun signInWithEmail(email: String, password: String): Result<StudentFirestoreDoc> {
        val auth = FirebaseManager.getAuth() ?: return Result.failure(IllegalStateException("Firebase Auth is not initialized"))
        return try {
            val authResult = auth.signInWithEmailAndPassword(email.trim(), password).await()
            val user = authResult.user ?: return Result.failure(IllegalStateException("Failed to obtain signed-in user"))
            val studentDoc = getOrSyncCurrentStudent()
                ?: StudentFirestoreDoc(id = user.uid, email = user.email, userName = email.substringBefore("@"))
            Result.success(studentDoc)
        } catch (e: Exception) {
            Log.e(TAG, "signInWithEmail failed: ${e.message}")
            Result.failure(e)
        }
    }

    /**
     * Registers a new student with email and password in Firebase Authentication
     * and initializes their profile in Firestore `/students/{uid}`.
     */
    suspend fun registerWithEmail(
        email: String,
        password: String,
        name: String,
        school: String,
        gradeLevel: String,
        region: String
    ): Result<StudentFirestoreDoc> {
        val auth = FirebaseManager.getAuth() ?: return Result.failure(IllegalStateException("Firebase Auth is not initialized"))
        return try {
            val authResult = auth.createUserWithEmailAndPassword(email.trim(), password).await()
            val user = authResult.user ?: return Result.failure(IllegalStateException("User creation failed"))

            val newDoc = StudentFirestoreDoc(
                id = user.uid,
                userName = name.ifBlank { email.substringBefore("@") },
                email = email.trim(),
                school = school.ifBlank { "SmartClass Academy" },
                schoolRegion = region.ifBlank { "Greater Accra" },
                gradeLevel = gradeLevel.ifBlank { "SHS 1" },
                rating = 1200,
                xp = 100,
                coins = 200,
                isOnline = true
            )
            updateStudentProfile(newDoc)
            Result.success(newDoc)
        } catch (e: Exception) {
            Log.e(TAG, "registerWithEmail failed: ${e.message}")
            Result.failure(e)
        }
    }

    /**
     * Signs in anonymously for guest or offline-first play while still getting a valid UID.
     */
    suspend fun signInAnonymously(): Result<StudentFirestoreDoc> {
        val auth = FirebaseManager.getAuth() ?: return Result.failure(IllegalStateException("Firebase Auth is not initialized"))
        return try {
            val authResult = auth.signInAnonymously().await()
            val user = authResult.user ?: return Result.failure(IllegalStateException("Anonymous sign-in failed"))
            val newDoc = StudentFirestoreDoc(
                id = user.uid,
                userName = "Guest Challenger",
                school = "SmartClass Guest",
                gradeLevel = "SHS 1",
                rating = 1200,
                xp = 50,
                coins = 100,
                isOnline = true
            )
            updateStudentProfile(newDoc)
            Result.success(newDoc)
        } catch (e: Exception) {
            Log.e(TAG, "signInAnonymously failed: ${e.message}")
            Result.failure(e)
        }
    }

    /**
     * Signs out from Firebase Authentication.
     */
    fun signOut() {
        try {
            FirebaseManager.getAuth()?.signOut()
        } catch (e: Exception) {
            Log.e(TAG, "signOut error: ${e.message}")
        }
    }

    /**
     * Saves or updates a student profile document in Firestore matching the web structure.
     */
    suspend fun updateStudentProfile(profile: StudentFirestoreDoc): Boolean {
        val firestore = FirebaseManager.getFirestore() ?: return false
        return try {
            val data = hashMapOf<String, Any>(
                "tenantId" to profile.tenantId,
                "curriculumId" to profile.curriculumId,
                "userName" to profile.userName,
                "school" to profile.school,
                "schoolRegion" to profile.schoolRegion,
                "gradeLevel" to profile.gradeLevel,
                "rating" to profile.rating,
                "xp" to profile.xp,
                "coins" to profile.coins,
                "wins" to profile.wins,
                "losses" to profile.losses,
                "draws" to profile.draws,
                "totalGames" to profile.totalGames,
                "winStreak" to profile.winStreak,
                "highestStreak" to profile.highestStreak,
                "isOnline" to true,
                "lastActive" to System.currentTimeMillis()
            )
            profile.email?.let { data["email"] = it }
            profile.schoolId?.let { data["schoolId"] = it }

            firestore.collection(STUDENTS_COLLECTION).document(profile.id).set(data).await()
            true
        } catch (e: Exception) {
            Log.e(TAG, "Error updating student profile: ${e.message}")
            false
        }
    }

    /**
     * Updates student live battle stats in Firestore /students/{studentId}
     * after a match is concluded on mobile.
     */
    suspend fun pushStudentStats(
        studentId: String,
        trophyDelta: Int,
        xpGained: Int,
        coinsGained: Int,
        isVictory: Boolean,
        newStreak: Int
    ): Boolean {
        val firestore = FirebaseManager.getFirestore() ?: return false
        return try {
            val docRef = firestore.collection(STUDENTS_COLLECTION).document(studentId)
            val snap = docRef.get().await()
            if (snap.exists()) {
                val currentRating = (snap.getLong("rating") ?: 1200).toInt()
                val currentXp = (snap.getLong("xp") ?: 0).toInt()
                val currentCoins = (snap.getLong("coins") ?: 100).toInt()
                val currentWins = (snap.getLong("wins") ?: 0).toInt()
                val currentLosses = (snap.getLong("losses") ?: 0).toInt()
                val currentTotal = (snap.getLong("totalGames") ?: 0).toInt()
                val currentHighest = (snap.getLong("highestStreak") ?: 0).toInt()

                val newRating = (currentRating + trophyDelta).coerceAtLeast(400)
                val newWins = if (isVictory) currentWins + 1 else currentWins
                val newLosses = if (!isVictory) currentLosses + 1 else currentLosses

                docRef.update(
                    mapOf(
                        "rating" to newRating,
                        "xp" to (currentXp + xpGained),
                        "coins" to (currentCoins + coinsGained),
                        "wins" to newWins,
                        "losses" to newLosses,
                        "totalGames" to (currentTotal + 1),
                        "winStreak" to newStreak,
                        "highestStreak" to maxOf(currentHighest, newStreak),
                        "lastActive" to System.currentTimeMillis(),
                        "isOnline" to true
                    )
                ).await()
                true
            } else {
                false
            }
        } catch (e: Exception) {
            Log.w(TAG, "pushStudentStats error: ${e.message}")
            false
        }
    }

    /**
     * Publishes a new challenge room document in Firestore.
     */
    suspend fun createChallengeRoom(challenge: ChallengeFirestoreDoc): String? {
        val firestore = FirebaseManager.getFirestore() ?: return null
        return try {
            val data = hashMapOf<String, Any>(
                "type" to challenge.type,
                "level" to challenge.level,
                "subject" to challenge.subject,
                "difficulty" to challenge.difficulty,
                "questionCount" to challenge.questionCount,
                "timeLimit" to challenge.timeLimit,
                "creatorId" to challenge.creatorId,
                "creatorName" to challenge.creatorName,
                "creatorSchool" to challenge.creatorSchool,
                "status" to challenge.status,
                "opponents" to challenge.opponents,
                "createdAt" to challenge.createdAt
            )
            challenge.roomCode?.let { data["roomCode"] = it }

            val docRef = if (challenge.id.isNotBlank()) {
                firestore.collection(CHALLENGES_COLLECTION).document(challenge.id).apply { set(data).await() }
            } else {
                firestore.collection(CHALLENGES_COLLECTION).add(data).await()
            }
            docRef.id
        } catch (e: Exception) {
            Log.e(TAG, "Error creating challenge room: ${e.message}")
            null
        }
    }

    /**
     * Resolves a challenge room by 6-character room code (e.g. SC-8421 or 8421).
     * Connects mobile participants with web hosts or other mobile hosts.
     */
    suspend fun findChallengeByRoomCode(roomCode: String): ChallengeFirestoreDoc? {
        val firestore = FirebaseManager.getFirestore() ?: return null
        return try {
            val queryCode = roomCode.trim().uppercase()
            val snap = firestore.collection(CHALLENGES_COLLECTION)
                .whereEqualTo("roomCode", queryCode)
                .limit(1)
                .get()
                .await()

            if (!snap.isEmpty) {
                val doc = snap.documents[0]
                ChallengeFirestoreDoc(
                    id = doc.id,
                    type = doc.getString("type") ?: "room",
                    level = doc.getString("level") ?: "SHS",
                    subject = doc.getString("subject") ?: "Mathematics",
                    difficulty = doc.getString("difficulty") ?: "medium",
                    questionCount = doc.getLong("questionCount")?.toInt() ?: 5,
                    timeLimit = doc.getLong("timeLimit")?.toInt() ?: 45,
                    creatorId = doc.getString("creatorId") ?: "",
                    creatorName = doc.getString("creatorName") ?: "Challenger",
                    creatorSchool = doc.getString("creatorSchool") ?: "SmartClass Academy",
                    roomCode = doc.getString("roomCode") ?: queryCode,
                    status = doc.getString("status") ?: "pending",
                    winner = doc.getString("winner"),
                    createdAt = doc.getLong("createdAt") ?: System.currentTimeMillis()
                )
            } else {
                null
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error looking up room code $roomCode: ${e.message}")
            null
        }
    }

    /**
     * Pushes school points from battle results to Firestore `/schools` collection.
     */
    suspend fun syncSchoolPoints(schoolName: String, pointsGained: Int, wonMatch: Boolean): Boolean {
        val firestore = FirebaseManager.getFirestore() ?: return false
        return try {
            val schoolId = schoolName.lowercase().replace("[^a-z0-9]".toRegex(), "-").take(32)
            val docRef = firestore.collection("schools").document(schoolId)
            val snap = docRef.get().await()

            if (snap.exists()) {
                val currentPoints = (snap.getLong("points") ?: 0).toInt()
                val currentWins = (snap.getLong("totalWins") ?: 0).toInt()
                val currentGames = (snap.getLong("totalGames") ?: 0).toInt()
                docRef.update(
                    mapOf(
                        "points" to (currentPoints + pointsGained),
                        "totalWins" to (if (wonMatch) currentWins + 1 else currentWins),
                        "totalGames" to (currentGames + 1),
                        "lastMatchTime" to System.currentTimeMillis()
                    )
                ).await()
            } else {
                docRef.set(
                    mapOf(
                        "schoolName" to schoolName,
                        "points" to pointsGained,
                        "totalWins" to (if (wonMatch) 1 else 0),
                        "totalGames" to 1,
                        "lastMatchTime" to System.currentTimeMillis()
                    )
                ).await()
            }
            true
        } catch (e: Exception) {
            Log.w(TAG, "syncSchoolPoints failed: ${e.message}")
            false
        }
    }

    /**
     * Persists a student's tournament registration in Firestore `/tournaments/{id}/participants`.
     */
    suspend fun syncTournamentRegistration(tournamentId: String, studentId: String, studentName: String): Boolean {
        val firestore = FirebaseManager.getFirestore() ?: return false
        return try {
            val regRef = firestore.collection("tournaments")
                .document(tournamentId)
                .collection("participants")
                .document(studentId)

            regRef.set(
                mapOf(
                    "studentId" to studentId,
                    "studentName" to studentName,
                    "registeredAt" to System.currentTimeMillis()
                )
            ).await()
            true
        } catch (e: Exception) {
            Log.w(TAG, "syncTournamentRegistration failed: ${e.message}")
            false
        }
    }

    /**
     * Performs a health check / ping on all active Firestore collections.
     */
    suspend fun pingFirestoreHealth(): Map<String, Boolean> {
        val firestore = FirebaseManager.getFirestore() ?: return emptyMap()
        val results = mutableMapOf<String, Boolean>()
        if (FirebaseManager.currentUser != null) {
            try {
                firestore.collection(STUDENTS_COLLECTION).limit(1).get().await()
                results[STUDENTS_COLLECTION] = true
            } catch (e: Exception) {
                results[STUDENTS_COLLECTION] = false
            }
        } else {
            results[STUDENTS_COLLECTION] = true
        }
        try {
            val challengesSnap = firestore.collection(CHALLENGES_COLLECTION).limit(1).get().await()
            results[CHALLENGES_COLLECTION] = true
        } catch (e: Exception) {
            results[CHALLENGES_COLLECTION] = false
        }
        return results
    }

    /**
     * Subscribes to live room updates via Firestore snapshot listener.
     */
    fun listenToChallengeRoom(roomId: String): Flow<ChallengeFirestoreDoc?> = callbackFlow {
        val firestore = FirebaseManager.getFirestore()
        if (firestore == null) {
            trySend(null)
            close()
            return@callbackFlow
        }

        val listener: ListenerRegistration = firestore.collection(CHALLENGES_COLLECTION).document(roomId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    Log.e(TAG, "Listen room failed: ${error.message}")
                    trySend(null)
                    return@addSnapshotListener
                }

                if (snapshot != null && snapshot.exists()) {
                    val doc = ChallengeFirestoreDoc(
                        id = snapshot.id,
                        type = snapshot.getString("type") ?: "quick",
                        level = snapshot.getString("level") ?: "SHS",
                        subject = snapshot.getString("subject") ?: "Mathematics",
                        difficulty = snapshot.getString("difficulty") ?: "medium",
                        questionCount = snapshot.getLong("questionCount")?.toInt() ?: 5,
                        timeLimit = snapshot.getLong("timeLimit")?.toInt() ?: 45,
                        creatorId = snapshot.getString("creatorId") ?: "",
                        creatorName = snapshot.getString("creatorName") ?: "",
                        creatorSchool = snapshot.getString("creatorSchool") ?: "",
                        roomCode = snapshot.getString("roomCode"),
                        status = snapshot.getString("status") ?: "pending",
                        winner = snapshot.getString("winner"),
                        createdAt = snapshot.getLong("createdAt") ?: System.currentTimeMillis()
                    )
                    trySend(doc)
                } else {
                    trySend(null)
                }
            }

        awaitClose { listener.remove() }
    }

    /**
     * Fetches authentic questions directly from the SmartClass24 Web challenges
     * stored in Firestore (`/challenges`).
     */
    @Suppress("UNCHECKED_CAST")
    suspend fun fetchQuestionsFromFirestore(): List<ArenaQuestion> {
        val firestore = FirebaseManager.getFirestore() ?: return emptyList()
        return try {
            val snapshot = firestore.collection(CHALLENGES_COLLECTION)
                .limit(50)
                .get()
                .await()

            val fetched = mutableListOf<ArenaQuestion>()
            for (doc in snapshot.documents) {
                val rawSubject = doc.getString("subject") ?: "Mathematics"
                val subjectEnum = Subject.fromName(rawSubject)
                val rawLevel = doc.getString("level") ?: "SHS"

                val questionsList = doc.get("questions") as? List<Map<String, Any>> ?: continue
                for (qMap in questionsList) {
                    val qText = (qMap["question"] ?: qMap["questionText"])?.toString() ?: continue
                    if (qText.isBlank()) continue

                    val rawOptions = (qMap["options"] as? List<*>)?.mapNotNull { it?.toString() } ?: emptyList()
                    val ansStr = qMap["correctAnswer"]?.toString()?.trim() ?: ""
                    val explanation = (qMap["explanation"] as? String)?.takeIf { it.isNotBlank() }
                        ?: "Correct answer: $ansStr"
                    val source = (qMap["source"] as? String)?.takeIf { it.isNotBlank() } ?: "WASSCE"
                    val points = (qMap["points"] as? Number)?.toInt() ?: 10

                    val finalOptions = if (rawOptions.isEmpty()) {
                        listOf("True", "False")
                    } else {
                        rawOptions
                    }

                    val matchedIdx = finalOptions.indexOfFirst { it.trim().equals(ansStr, ignoreCase = true) }
                    val correctIdx = if (matchedIdx >= 0) {
                        matchedIdx
                    } else if (ansStr.equals("true", ignoreCase = true)) {
                        0
                    } else if (ansStr.equals("false", ignoreCase = true)) {
                        1
                    } else if (ansStr.toIntOrNull() != null && ansStr.toInt() in finalOptions.indices) {
                        ansStr.toInt()
                    } else {
                        0
                    }

                    val curriculum = when {
                        source.contains("cambridge", ignoreCase = true) -> Curriculum.CAMBRIDGE_IGCSE
                        rawSubject.contains("arabic", ignoreCase = true) -> Curriculum.UAE_MOE
                        source.contains("common", ignoreCase = true) -> Curriculum.COMMON_CORE
                        else -> Curriculum.WASSCE_BECE
                    }

                    val qId = (qMap["id"] as? String)?.takeIf { it.isNotBlank() }
                        ?: "fs_${doc.id}_${fetched.size}"

                    fetched.add(
                        ArenaQuestion(
                            id = qId,
                            subject = subjectEnum,
                            curriculum = curriculum,
                            questionText = qText,
                            options = finalOptions,
                            correctIndex = correctIdx,
                            explanation = explanation,
                            keyConcept = "$source $rawSubject",
                            difficulty = if (points > 10) "Hard" else if (points <= 5) "Easy" else "Medium"
                        )
                    )
                }
            }
            Log.d(TAG, "Successfully fetched ${fetched.size} live questions from Firestore challenges")
            fetched
        } catch (e: Exception) {
            Log.w(TAG, "Failed to load live questions from Firestore: ${e.message}")
            emptyList()
        }
    }

    /**
     * Fetches friends and students from Firestore `/students` collection.
     */
    suspend fun fetchFirestoreFriends(currentUserId: String): List<FriendPlayer> {
        val firestore = FirebaseManager.getFirestore() ?: return emptyList()
        if (FirebaseManager.currentUser == null) {
            return emptyList()
        }
        return try {
            val snapshot = firestore.collection(STUDENTS_COLLECTION)
                .limit(30)
                .get()
                .await()

            snapshot.documents.mapNotNull { doc ->
                if (doc.id == currentUserId || doc.id.startsWith("bot-")) return@mapNotNull null
                val name = doc.getString("userName") ?: doc.getString("studentName") ?: return@mapNotNull null
                val school = doc.getString("school") ?: doc.getString("schoolName") ?: "SmartClass Academy"
                val level = if (doc.getString("studentClass")?.contains("JHS") == true) "JHS" else "SHS"
                val isOnline = doc.getBoolean("isOnline") ?: (doc.get("lastActive") != null || doc.get("lastSeen") != null)
                val rating = doc.getLong("rating")?.toInt() ?: 1200
                val flag = if (school.contains("UAE") || school.contains("Dubai")) "🇦🇪"
                    else if (school.contains("Nigeria") || school.contains("Lagos")) "🇳🇬"
                    else "🇬🇭"
                val avatar = doc.getString("avatar") ?: if (name.endsWith("a") || name.endsWith("i")) "👩‍🎓" else "👨‍🎓"

                FriendPlayer(
                    id = doc.id,
                    name = name,
                    school = school,
                    level = level,
                    avatarEmoji = avatar,
                    isOnline = isOnline,
                    isBot = false,
                    statusText = if (isOnline) "Online" else "Active recently",
                    rating = rating,
                    flag = flag
                )
            }
        } catch (e: Exception) {
            Log.w(TAG, "Failed to load students from Firestore: ${e.message}")
            emptyList()
        }
    }
}
