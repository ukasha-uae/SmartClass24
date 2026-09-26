package com.example.model

enum class LinkSyncStatus {
    ACTIVE,
    SYNCING,
    VERIFIED,
    IDLE
}

data class LogicalLinkChannel(
    val id: String,
    val title: String,
    val category: String,
    val firestoreCollection: String,
    val description: String,
    val status: LinkSyncStatus = LinkSyncStatus.ACTIVE,
    val lastSyncTime: String = "Just now",
    val itemsSynced: String = "",
    val details: String = "",
    val isFunctional: Boolean = true
)

data class SyncTrackerProgress(
    val totalChannels: Int = 5,
    val activeChannels: Int = 5,
    val lastFullSyncTime: String = "Just now",
    val cloudProjectId: String = "smartclass24-5e590",
    val isOnline: Boolean = true,
    val channels: List<LogicalLinkChannel> = emptyList()
)
