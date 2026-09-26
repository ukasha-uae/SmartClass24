package com.example.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.Stars
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.UserProfileEntity
import com.example.model.ShopItem
import com.example.model.ShopItemCategory
import com.example.ui.theme.ScBackground
import com.example.ui.theme.ScBorder
import com.example.ui.theme.ScForeground
import com.example.ui.theme.ScPrimaryBlue
import com.example.ui.theme.ScPrimaryIndigo
import com.example.ui.theme.ScSuccessGreen
import com.example.ui.theme.ScSurface
import com.example.ui.theme.ScTextMuted

@Composable
fun ArenaShopScreen(
    userProfile: UserProfileEntity,
    shopItems: List<ShopItem>,
    feedbackMessage: String?,
    onBuyItem: (String) -> Unit,
    onEquipTitle: (String) -> Unit,
    onEquipAvatar: (String) -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    BackHandler { onBack() }

    var selectedTabIndex by remember { mutableIntStateOf(0) }
    val tabs = listOf("⚡ Power-Ups", "👑 Titles", "🎭 Avatars")

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(ScBackground)
            .testTag("arena_shop_screen")
    ) {
        // Top Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onBack,
                modifier = Modifier.testTag("shop_back_button")
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = ScForeground
                )
            }
            Spacer(modifier = Modifier.width(4.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Armory & Shop",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = ScForeground
                )
                Text(
                    text = "Boosters, custom avatars & scholar titles",
                    style = MaterialTheme.typography.bodySmall,
                    color = ScTextMuted
                )
            }
            // Coin Pill Badge
            Surface(
                shape = RoundedCornerShape(50),
                color = Color(0xFFFEF3C7),
                border = BorderStroke(1.dp, Color(0xFFFDE68A)),
                modifier = Modifier.testTag("shop_coin_pill")
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "💰", fontSize = 16.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${userProfile.coins}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Black,
                        color = Color(0xFFB45309)
                    )
                }
            }
        }

        // Feedback Banner
        if (!feedbackMessage.isNullOrBlank()) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                shape = RoundedCornerShape(10.dp),
                color = if (feedbackMessage.contains("Not enough", ignoreCase = true)) Color(0xFFFEE2E2) else Color(0xFFDCFCE7),
                border = BorderStroke(1.dp, if (feedbackMessage.contains("Not enough", ignoreCase = true)) Color(0xFFFCA5A5) else Color(0xFF86EFAC))
            ) {
                Text(
                    text = feedbackMessage,
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.SemiBold,
                    color = if (feedbackMessage.contains("Not enough", ignoreCase = true)) Color(0xFF991B1B) else Color(0xFF166534),
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                )
            }
        }

        // Header Card with current equipped title & avatar
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = ScSurface),
            border = BorderStroke(1.dp, ScBorder)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = CircleShape,
                    color = Color.White,
                    border = BorderStroke(2.dp, ScPrimaryBlue),
                    modifier = Modifier.size(52.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(text = userProfile.avatarEmoji.ifBlank { "👨‍🎓" }, fontSize = 28.sp)
                    }
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = userProfile.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = ScForeground
                    )
                    Text(
                        text = userProfile.title.ifBlank { "Arena Challenger" },
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.SemiBold,
                        color = ScPrimaryBlue
                    )
                    Text(
                        text = "Level ${userProfile.level} • ${userProfile.xp} XP",
                        style = MaterialTheme.typography.labelSmall,
                        color = ScTextMuted
                    )
                }
            }
        }

        // Tabs
        TabRow(
            selectedTabIndex = selectedTabIndex,
            containerColor = ScSurface,
            contentColor = ScPrimaryBlue,
            indicator = { tabPositions ->
                TabRowDefaults.SecondaryIndicator(
                    modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTabIndex]),
                    color = ScPrimaryBlue
                )
            }
        ) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTabIndex == index,
                    onClick = { selectedTabIndex = index },
                    text = {
                        Text(
                            text = title,
                            fontWeight = if (selectedTabIndex == index) FontWeight.Bold else FontWeight.Medium,
                            fontSize = 13.sp
                        )
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Tab Content
        when (selectedTabIndex) {
            0 -> PowerUpsTab(
                userCoins = userProfile.coins,
                userProfile = userProfile,
                powerUpItems = shopItems.filter { it.category == ShopItemCategory.POWER_UP },
                onBuyItem = onBuyItem
            )
            1 -> TitlesTab(
                userCoins = userProfile.coins,
                currentTitle = userProfile.title,
                unlockedTitles = userProfile.unlockedTitles.split(",").map { it.trim() },
                titleItems = shopItems.filter { it.category == ShopItemCategory.TITLE },
                onBuyItem = onBuyItem,
                onEquipTitle = onEquipTitle
            )
            2 -> AvatarsTab(
                userCoins = userProfile.coins,
                currentAvatar = userProfile.avatarEmoji,
                unlockedAvatars = userProfile.unlockedAvatars.split(",").map { it.trim() },
                avatarItems = shopItems.filter { it.category == ShopItemCategory.AVATAR },
                onBuyItem = onBuyItem,
                onEquipAvatar = onEquipAvatar
            )
        }
    }
}

@Composable
private fun PowerUpsTab(
    userCoins: Int,
    userProfile: UserProfileEntity,
    powerUpItems: List<ShopItem>,
    onBuyItem: (String) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Combat Boosters (In Stock)",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = ScTextMuted
            )
        }

        items(powerUpItems) { item ->
            val inStockCount = when (item.id) {
                "pu_5050" -> userProfile.powerUpFiftyFifty
                "pu_freeze" -> userProfile.powerUpFreeze
                "pu_boost" -> userProfile.powerUpBoost
                "pu_shield" -> userProfile.powerUpShield
                else -> 0
            }
            val canAfford = userCoins >= item.priceCoins

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("shop_item_${item.id}"),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = ScSurface),
                border = BorderStroke(1.dp, ScBorder)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFF1F5F9),
                        modifier = Modifier.size(50.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(text = item.iconEmoji, fontSize = 26.sp)
                        }
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = item.name,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = ScForeground
                            )
                            if (item.badgeTag != null) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Surface(
                                    shape = RoundedCornerShape(4.dp),
                                    color = Color(0xFFEFF6FF),
                                    border = BorderStroke(0.5.dp, Color(0xFF93C5FD))
                                ) {
                                    Text(
                                        text = item.badgeTag,
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = ScPrimaryBlue,
                                        fontSize = 10.sp,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = item.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = ScTextMuted
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Owned: $inStockCount in inventory",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = ScPrimaryIndigo
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Button(
                        onClick = { onBuyItem(item.id) },
                        enabled = canAfford,
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF2563EB),
                            disabledContainerColor = Color(0xFFE2E8F0)
                        ),
                        modifier = Modifier.testTag("buy_button_${item.id}")
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "+${item.quantityPerPurchase}",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.ExtraBold,
                                color = if (canAfford) Color.White else Color(0xFF94A3B8)
                            )
                            Text(
                                text = "${item.priceCoins} 💰",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = if (canAfford) Color(0xFFFEF08A) else Color(0xFF94A3B8)
                            )
                        }
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun TitlesTab(
    userCoins: Int,
    currentTitle: String,
    unlockedTitles: List<String>,
    titleItems: List<ShopItem>,
    onBuyItem: (String) -> Unit,
    onEquipTitle: (String) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Scholar Titles & Academic Honors",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = ScTextMuted
            )
        }

        items(titleItems) { item ->
            val isUnlocked = unlockedTitles.any { it.equals(item.name, ignoreCase = true) }
            val isEquipped = currentTitle.equals(item.name, ignoreCase = true)
            val canAfford = userCoins >= item.priceCoins

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("title_item_${item.id}"),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isEquipped) Color(0xFFEFF6FF) else ScSurface
                ),
                border = BorderStroke(
                    1.dp,
                    if (isEquipped) ScPrimaryBlue else ScBorder
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = item.iconEmoji, fontSize = 24.sp)
                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = item.name,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground
                        )
                        Text(
                            text = item.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = ScTextMuted
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    when {
                        isEquipped -> {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Color(0xFFDCFCE7),
                                border = BorderStroke(1.dp, Color(0xFF86EFAC))
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Check,
                                        contentDescription = "Equipped",
                                        tint = ScSuccessGreen,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "Active",
                                        style = MaterialTheme.typography.labelMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = ScSuccessGreen
                                    )
                                }
                            }
                        }
                        isUnlocked -> {
                            OutlinedButton(
                                onClick = { onEquipTitle(item.name) },
                                shape = RoundedCornerShape(8.dp),
                                border = BorderStroke(1.dp, ScPrimaryBlue)
                            ) {
                                Text(
                                    text = "Equip",
                                    color = ScPrimaryBlue,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        else -> {
                            Button(
                                onClick = { onBuyItem(item.id) },
                                enabled = canAfford,
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color(0xFFD97706),
                                    disabledContainerColor = Color(0xFFE2E8F0)
                                )
                            ) {
                                Text(
                                    text = "${item.priceCoins} 💰",
                                    fontWeight = FontWeight.Bold,
                                    color = if (canAfford) Color.White else Color(0xFF94A3B8)
                                )
                            }
                        }
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun AvatarsTab(
    userCoins: Int,
    currentAvatar: String,
    unlockedAvatars: List<String>,
    avatarItems: List<ShopItem>,
    onBuyItem: (String) -> Unit,
    onEquipAvatar: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "Avatar & Profile Flairs",
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold,
            color = ScTextMuted
        )
        Spacer(modifier = Modifier.height(10.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(avatarItems) { item ->
                val isUnlocked = unlockedAvatars.any { it.trim() == item.iconEmoji.trim() }
                val isEquipped = currentAvatar.trim() == item.iconEmoji.trim()
                val canAfford = userCoins >= item.priceCoins

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("avatar_card_${item.id}"),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isEquipped) Color(0xFFEFF6FF) else ScSurface
                    ),
                    border = BorderStroke(
                        1.5.dp,
                        if (isEquipped) ScPrimaryBlue else ScBorder
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Color.White,
                            border = BorderStroke(2.dp, if (isEquipped) ScPrimaryBlue else Color(0xFFE2E8F0)),
                            modifier = Modifier.size(56.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(text = item.iconEmoji, fontSize = 28.sp)
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = item.name,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold,
                            color = ScForeground,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Text(
                            text = item.description,
                            style = MaterialTheme.typography.labelSmall,
                            color = ScTextMuted,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        when {
                            isEquipped -> {
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = Color(0xFFDCFCE7),
                                    border = BorderStroke(1.dp, Color(0xFF86EFAC)),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = "✓ Active",
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = ScSuccessGreen,
                                        modifier = Modifier.padding(vertical = 6.dp),
                                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                                    )
                                }
                            }
                            isUnlocked -> {
                                OutlinedButton(
                                    onClick = { onEquipAvatar(item.iconEmoji) },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(8.dp),
                                    border = BorderStroke(1.dp, ScPrimaryBlue)
                                ) {
                                    Text(
                                        text = "Equip",
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = ScPrimaryBlue
                                    )
                                }
                            }
                            else -> {
                                Button(
                                    onClick = { onBuyItem(item.id) },
                                    enabled = canAfford,
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = ScPrimaryIndigo,
                                        disabledContainerColor = Color(0xFFE2E8F0)
                                    )
                                ) {
                                    Text(
                                        text = "${item.priceCoins} 💰",
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = if (canAfford) Color.White else Color(0xFF94A3B8)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
