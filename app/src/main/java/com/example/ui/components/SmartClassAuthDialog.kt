package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.CloudDone
import androidx.compose.material.icons.filled.CloudSync
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.data.UserProfileEntity
import com.example.ui.theme.ScBackground
import com.example.ui.theme.ScBorder
import com.example.ui.theme.ScDestructiveRed
import com.example.ui.theme.ScForeground
import com.example.ui.theme.ScPrimaryBlue
import com.example.ui.theme.ScPrimaryIndigo
import com.example.ui.theme.ScSuccessGreen
import com.example.ui.theme.ScSurface
import com.example.ui.theme.ScSurfaceMuted
import com.example.ui.theme.ScTextMuted
import com.example.viewmodel.ArenaUiState

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun SmartClassAuthDialog(
    state: ArenaUiState,
    onDismiss: () -> Unit,
    onSignIn: (String, String) -> Unit,
    onRegister: (String, String, String, String, String, String) -> Unit,
    onGuestSignIn: () -> Unit,
    onSignOut: () -> Unit,
    onSyncWithCloud: () -> Unit,
    onUpdateProfile: (String, String, String, String) -> Unit,
    onClearMessages: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedTab by remember {
        mutableIntStateOf(if (state.userProfile.firebaseUid != null || state.userProfile.isCloudSynced) 0 else 1)
    }

    // Sign in fields
    var signInEmail by remember { mutableStateOf(state.userProfile.email ?: "ukasha.uae@gmail.com") }
    var signInPassword by remember { mutableStateOf("") }
    var showSignInPassword by remember { mutableStateOf(false) }

    // Register fields
    var regName by remember { mutableStateOf(state.userProfile.name) }
    var regEmail by remember { mutableStateOf(state.userProfile.email ?: "ukasha.uae@gmail.com") }
    var regPassword by remember { mutableStateOf("") }
    var regSchool by remember { mutableStateOf(state.userProfile.school) }
    var regGrade by remember { mutableStateOf(state.userProfile.gradeLevel) }
    var regRegion by remember { mutableStateOf(state.userProfile.selectedRegion) }
    var showRegPassword by remember { mutableStateOf(false) }

    // Edit Profile details in Tab 0
    var editName by remember { mutableStateOf(state.userProfile.name) }
    var editSchool by remember { mutableStateOf(state.userProfile.school) }
    var editGrade by remember { mutableStateOf(state.userProfile.gradeLevel) }
    var editRegion by remember { mutableStateOf(state.userProfile.selectedRegion) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Card(
            modifier = modifier
                .fillMaxWidth(0.95f)
                .testTag("auth_identity_dialog"),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = ScSurface),
            border = BorderStroke(1.5.dp, Color(0xFFBFDBFE))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(20.dp)
            ) {
                // Header: Web Brand & Sync Pill
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = ScPrimaryBlue,
                            modifier = Modifier.size(38.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(text = "🎓", fontSize = 20.sp)
                            }
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "SmartClass24",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.ExtraBold,
                                color = ScForeground
                            )
                            Text(
                                text = "Student Account",
                                style = MaterialTheme.typography.labelSmall,
                                color = ScTextMuted
                            )
                        }
                    }

                    // Cloud state badge
                    Surface(
                        shape = RoundedCornerShape(20.dp),
                        color = if (state.userProfile.isCloudSynced) Color(0xFFDCFCE7) else Color(0xFFFEF3C7),
                        border = BorderStroke(
                            1.dp,
                            if (state.userProfile.isCloudSynced) Color(0xFF86EFAC) else Color(0xFFFDE68A)
                        )
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = if (state.userProfile.isCloudSynced) Icons.Default.CloudDone else Icons.Default.CloudSync,
                                contentDescription = null,
                                tint = if (state.userProfile.isCloudSynced) ScSuccessGreen else Color(0xFFD97706),
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (state.userProfile.isCloudSynced) "Web Synced" else "Offline / Local",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (state.userProfile.isCloudSynced) ScSuccessGreen else Color(0xFFB45309)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Feedback Banners
                AnimatedVisibility(
                    visible = state.authSuccessMessage != null,
                    enter = fadeIn(),
                    exit = fadeOut()
                ) {
                    state.authSuccessMessage?.let { msg ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Color(0xFFF0FDF4),
                            border = BorderStroke(1.dp, Color(0xFFBBF7D0)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 12.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = ScSuccessGreen,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = msg,
                                    fontSize = 12.sp,
                                    color = Color(0xFF166534),
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }
                }

                AnimatedVisibility(
                    visible = state.authErrorMessage != null,
                    enter = fadeIn(),
                    exit = fadeOut()
                ) {
                    state.authErrorMessage?.let { err ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Color(0xFFFEF2F2),
                            border = BorderStroke(1.dp, Color(0xFFFECACA)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 12.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.ErrorOutline,
                                    contentDescription = null,
                                    tint = ScDestructiveRed,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = err,
                                    fontSize = 12.sp,
                                    color = Color(0xFF991B1B),
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }
                }

                // Primary Tabs
                PrimaryTabRow(
                    selectedTabIndex = selectedTab,
                    containerColor = Color(0xFFF1F5F9),
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .padding(2.dp)
                ) {
                    Tab(
                        selected = selectedTab == 0,
                        onClick = {
                            selectedTab = 0
                            onClearMessages()
                        },
                        text = { Text("Profile & Cloud", fontSize = 12.sp, fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = selectedTab == 1,
                        onClick = {
                            selectedTab = 1
                            onClearMessages()
                        },
                        text = { Text("Email Login", fontSize = 12.sp, fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = selectedTab == 2,
                        onClick = {
                            selectedTab = 2
                            onClearMessages()
                        },
                        text = { Text("Register", fontSize = 12.sp, fontWeight = FontWeight.Bold) }
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                when (selectedTab) {
                    0 -> {
                        // TAB 0: Profile & Cloud Synchronization
                        ProfileSyncTabContent(
                            profile = state.userProfile,
                            isSyncing = state.isSyncingProfile,
                            editName = editName,
                            onNameChange = { editName = it },
                            editSchool = editSchool,
                            onSchoolChange = { editSchool = it },
                            editGrade = editGrade,
                            onGradeChange = { editGrade = it },
                            editRegion = editRegion,
                            onRegionChange = { editRegion = it },
                            onSyncCloud = onSyncWithCloud,
                            onSaveProfile = {
                                onUpdateProfile(editName, editSchool, editGrade, editRegion)
                            },
                            onSignOut = onSignOut
                        )
                    }

                    1 -> {
                        // TAB 1: Sign In
                        SignInTabContent(
                            email = signInEmail,
                            onEmailChange = { signInEmail = it },
                            password = signInPassword,
                            onPasswordChange = { signInPassword = it },
                            showPassword = showSignInPassword,
                            onTogglePassword = { showSignInPassword = !showSignInPassword },
                            isLoading = state.isAuthLoading,
                            onSignIn = { onSignIn(signInEmail, signInPassword) },
                            onGuestSignIn = onGuestSignIn
                        )
                    }

                    2 -> {
                        // TAB 2: Register
                        RegisterTabContent(
                            name = regName,
                            onNameChange = { regName = it },
                            email = regEmail,
                            onEmailChange = { regEmail = it },
                            password = regPassword,
                            onPasswordChange = { regPassword = it },
                            school = regSchool,
                            onSchoolChange = { regSchool = it },
                            grade = regGrade,
                            onGradeChange = { regGrade = it },
                            region = regRegion,
                            onRegionChange = { regRegion = it },
                            showPassword = showRegPassword,
                            onTogglePassword = { showRegPassword = !showRegPassword },
                            isLoading = state.isAuthLoading,
                            onRegister = {
                                onRegister(regEmail, regPassword, regName, regSchool, regGrade, regRegion)
                            }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Close Button
                OutlinedButton(
                    onClick = onDismiss,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, ScBorder)
                ) {
                    Text("Close", color = ScTextMuted, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ProfileSyncTabContent(
    profile: UserProfileEntity,
    isSyncing: Boolean,
    editName: String,
    onNameChange: (String) -> Unit,
    editSchool: String,
    onSchoolChange: (String) -> Unit,
    editGrade: String,
    onGradeChange: (String) -> Unit,
    editRegion: String,
    onRegionChange: (String) -> Unit,
    onSyncCloud: () -> Unit,
    onSaveProfile: () -> Unit,
    onSignOut: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
        // Linked Identity Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFEFF6FF)),
            border = BorderStroke(1.dp, Color(0xFFBFDBFE))
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = CircleShape,
                        color = Color.White,
                        border = BorderStroke(2.dp, ScPrimaryBlue),
                        modifier = Modifier.size(46.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(text = "👨‍🎓", fontSize = 22.sp)
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = profile.name,
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = ScPrimaryBlue
                        )
                        Text(
                            text = profile.email ?: "ukasha.uae@gmail.com",
                            style = MaterialTheme.typography.bodySmall,
                            color = ScTextMuted
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))
                HorizontalDivider(color = Color(0xFFDBEAFE))
                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    StatPill("Rating", "${profile.trophies} 🏆", Color(0xFF2563EB))
                    StatPill("Wins", "${profile.victories} ⚔️", Color(0xFFD97706))
                    StatPill("Streak", "${profile.currentStreak} 🔥", Color(0xFF059669))
                    StatPill("Coins", "${profile.coins} 🪙", Color(0xFFCA8A04))
                }

            }
        }

        // Quick Sync with Cloud Action
        Button(
            onClick = onSyncCloud,
            enabled = !isSyncing,
            modifier = Modifier
                .fillMaxWidth()
                .height(46.dp)
                .testTag("sync_cloud_button"),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = ScPrimaryBlue)
        ) {
            if (isSyncing) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Syncing profile...", fontWeight = FontWeight.Bold)
            } else {
                Icon(imageVector = Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Refresh from SmartClass24 Web", fontWeight = FontWeight.Bold)
            }
        }

        // Editable Student Profile Fields
        Text(
            text = "Edit Student Profile",
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold,
            color = ScForeground
        )

        OutlinedTextField(
            value = editName,
            onValueChange = onNameChange,
            label = { Text("Full Name") },
            leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        OutlinedTextField(
            value = editSchool,
            onValueChange = onSchoolChange,
            label = { Text("School / Institution") },
            leadingIcon = { Icon(Icons.Default.School, contentDescription = null) },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        // School Quick Suggestions
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            listOf(
                "S24 Innovation Academy",
                "SmartClass International, Dubai",
                "PRESEC Legon",
                "Prempeh College",
                "Achimota School"
            ).forEach { suggestion ->
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Color(0xFFF1F5F9),
                    border = BorderStroke(1.dp, ScBorder),
                    modifier = Modifier.clickable { onSchoolChange(suggestion) }
                ) {
                    Text(
                        text = suggestion,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        color = ScTextMuted,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
            }
        }

        // Grade Level Chips
        Text(
            text = "Grade / Class Level",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.SemiBold,
            color = ScForeground
        )
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            listOf("Innovation Track", "SHS 1", "SHS 2", "SHS 3", "JHS 3", "JHS 2", "JHS 1").forEach { grade ->
                val isSelected = editGrade.equals(grade, ignoreCase = true)
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = if (isSelected) ScPrimaryBlue else Color(0xFFF1F5F9),
                    border = BorderStroke(1.dp, if (isSelected) ScPrimaryBlue else ScBorder),
                    modifier = Modifier.clickable { onGradeChange(grade) }
                ) {
                    Text(
                        text = grade,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isSelected) Color.White else ScForeground,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                    )
                }
            }
        }

        // Region Chips
        Text(
            text = "Region",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.SemiBold,
            color = ScForeground
        )
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            listOf("UAE", "Greater Accra", "Ashanti", "Lagos", "Central").forEach { reg ->
                val isSelected = editRegion.equals(reg, ignoreCase = true)
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = if (isSelected) Color(0xFF1E40AF) else Color(0xFFF1F5F9),
                    border = BorderStroke(1.dp, if (isSelected) Color(0xFF1E40AF) else ScBorder),
                    modifier = Modifier.clickable { onRegionChange(reg) }
                ) {
                    Text(
                        text = reg,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isSelected) Color.White else ScForeground,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                    )
                }
            }
        }

        // Save Button
        Button(
            onClick = onSaveProfile,
            modifier = Modifier
                .fillMaxWidth()
                .height(46.dp)
                .testTag("save_profile_button"),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0F172A))
        ) {
            Text("Save Profile Changes", fontWeight = FontWeight.Bold, color = Color.White)
        }

        if (profile.firebaseUid != null) {
            OutlinedButton(
                onClick = onSignOut,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(40.dp),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Color(0xFFFCA5A5))
            ) {
                Text("Sign Out", color = ScDestructiveRed, fontSize = 12.sp)
            }
        }
    }
}

@Composable
private fun SignInTabContent(
    email: String,
    onEmailChange: (String) -> Unit,
    password: String,
    onPasswordChange: (String) -> Unit,
    showPassword: Boolean,
    onTogglePassword: () -> Unit,
    isLoading: Boolean,
    onSignIn: () -> Unit,
    onGuestSignIn: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Text(
            text = "Sign In with SmartClass24 Web Account",
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold,
            color = ScForeground
        )
        Text(
            text = "Link your mobile device with your Web profile to sync ELO ratings, XP, and tournaments.",
            style = MaterialTheme.typography.bodySmall,
            color = ScTextMuted
        )

        // Quick 1-Tap Fill for ukasha.uae@gmail.com
        Surface(
            shape = RoundedCornerShape(10.dp),
            color = Color(0xFFEFF6FF),
            border = BorderStroke(1.dp, Color(0xFFBFDBFE)),
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onEmailChange("ukasha.uae@gmail.com") }
        ) {
            Row(
                modifier = Modifier.padding(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "💡 Quick Tap:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = ScPrimaryBlue)
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = "ukasha.uae@gmail.com", fontSize = 11.sp, color = ScPrimaryBlue)
            }
        }

        OutlinedTextField(
            value = email,
            onValueChange = onEmailChange,
            label = { Text("Email Address") },
            leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        OutlinedTextField(
            value = password,
            onValueChange = onPasswordChange,
            label = { Text("Password") },
            leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
            trailingIcon = {
                IconButton(onClick = onTogglePassword) {
                    Icon(
                        imageVector = if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                        contentDescription = null
                    )
                }
            },
            visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        Button(
            onClick = onSignIn,
            enabled = !isLoading && email.isNotBlank(),
            modifier = Modifier
                .fillMaxWidth()
                .height(46.dp)
                .testTag("signin_submit_button"),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = ScPrimaryBlue)
        ) {
            if (isLoading) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Authenticating...", fontWeight = FontWeight.Bold)
            } else {
                Text("Sign In & Link Profile", fontWeight = FontWeight.Bold)
            }
        }

        HorizontalDivider(color = ScBorder)

        // Guest sign-in
        OutlinedButton(
            onClick = onGuestSignIn,
            enabled = !isLoading,
            modifier = Modifier
                .fillMaxWidth()
                .height(42.dp),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, ScBorder)
        ) {
            Text("Play as Guest (Offline/Anonymous)", color = ScForeground, fontSize = 12.sp)
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun RegisterTabContent(
    name: String,
    onNameChange: (String) -> Unit,
    email: String,
    onEmailChange: (String) -> Unit,
    password: String,
    onPasswordChange: (String) -> Unit,
    school: String,
    onSchoolChange: (String) -> Unit,
    grade: String,
    onGradeChange: (String) -> Unit,
    region: String,
    onRegionChange: (String) -> Unit,
    showPassword: Boolean,
    onTogglePassword: () -> Unit,
    isLoading: Boolean,
    onRegister: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(
            text = "Create SmartClass24 Student Account",
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold,
            color = ScForeground
        )

        OutlinedTextField(
            value = name,
            onValueChange = onNameChange,
            label = { Text("Full Name") },
            leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        OutlinedTextField(
            value = email,
            onValueChange = onEmailChange,
            label = { Text("Email Address") },
            leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        OutlinedTextField(
            value = password,
            onValueChange = onPasswordChange,
            label = { Text("Password (min 6 characters)") },
            leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
            trailingIcon = {
                IconButton(onClick = onTogglePassword) {
                    Icon(
                        imageVector = if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                        contentDescription = null
                    )
                }
            },
            visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        OutlinedTextField(
            value = school,
            onValueChange = onSchoolChange,
            label = { Text("School / Institution") },
            leadingIcon = { Icon(Icons.Default.School, contentDescription = null) },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            listOf(
                "S24 Innovation Academy",
                "SmartClass International, Dubai",
                "PRESEC Legon",
                "Achimota School"
            ).forEach { suggestion ->
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Color(0xFFF1F5F9),
                    border = BorderStroke(1.dp, ScBorder),
                    modifier = Modifier.clickable { onSchoolChange(suggestion) }
                ) {
                    Text(
                        text = suggestion,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        color = ScTextMuted,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
            }
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = grade,
                onValueChange = onGradeChange,
                label = { Text("Grade (e.g. SHS 1)") },
                singleLine = true,
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(12.dp)
            )

            OutlinedTextField(
                value = region,
                onValueChange = onRegionChange,
                label = { Text("Region") },
                singleLine = true,
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(12.dp)
            )
        }

        Button(
            onClick = onRegister,
            enabled = !isLoading && email.isNotBlank() && password.length >= 6,
            modifier = Modifier
                .fillMaxWidth()
                .height(46.dp)
                .testTag("register_submit_button"),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = ScPrimaryBlue)
        ) {
            if (isLoading) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Creating Account...", fontWeight = FontWeight.Bold)
            } else {
                Text("Create Account & Sync to Web", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun StatPill(label: String, value: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = value, fontWeight = FontWeight.ExtraBold, fontSize = 13.sp, color = color)
        Text(text = label, fontSize = 10.sp, color = ScTextMuted)
    }
}
