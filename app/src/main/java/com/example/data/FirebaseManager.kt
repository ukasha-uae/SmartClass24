package com.example.data

import android.content.Context
import android.util.Log
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

object FirebaseManager {
    const val TARGET_PROJECT_ID = "smartclass24-5e590"
    const val APPLICATION_PACKAGE_NAME = "com.aistudio.smartclassarena.uydq"

    /**
     * Checks if Firebase is initialized in this Android runtime.
     */
    fun isFirebaseInitialized(): Boolean {
        return try {
            FirebaseApp.getApps(FirebaseApp.getInstance().applicationContext).isNotEmpty()
        } catch (e: Exception) {
            false
        }
    }

    /**
     * Returns the active project ID, or null if Firebase is not yet initialized.
     */
    fun getActiveProjectId(): String? {
        return try {
            val app = FirebaseApp.getInstance()
            app.options.projectId
        } catch (e: Exception) {
            null
        }
    }

    /**
     * Returns FirebaseFirestore instance if initialized, or null.
     */
    fun getFirestore(): FirebaseFirestore? {
        return try {
            if (isFirebaseInitialized()) FirebaseFirestore.getInstance() else null
        } catch (e: Exception) {
            Log.w("FirebaseManager", "Firestore not available: ${e.message}")
            null
        }
    }

    /**
     * Returns FirebaseAuth instance if initialized, or null.
     */
    fun getAuth(): FirebaseAuth? {
        return try {
            if (isFirebaseInitialized()) FirebaseAuth.getInstance() else null
        } catch (e: Exception) {
            Log.w("FirebaseManager", "FirebaseAuth not available: ${e.message}")
            null
        }
    }

    val currentUser: FirebaseUser?
        get() = getAuth()?.currentUser

    val currentUserId: String?
        get() = currentUser?.uid

    val currentUserEmail: String?
        get() = currentUser?.email
}
