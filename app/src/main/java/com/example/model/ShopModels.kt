package com.example.model

enum class ShopItemCategory {
    POWER_UP,
    TITLE,
    AVATAR
}

data class ShopItem(
    val id: String,
    val name: String,
    val description: String,
    val category: ShopItemCategory,
    val priceCoins: Int,
    val iconEmoji: String,
    val quantityPerPurchase: Int = 1,
    val isUnlocked: Boolean = false,
    val isEquipped: Boolean = false,
    val badgeTag: String? = null
)
