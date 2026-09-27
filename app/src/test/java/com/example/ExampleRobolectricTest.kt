package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.model.ArenaMode
import com.example.viewmodel.ArenaScreen
import com.example.viewmodel.ArenaViewModel
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("SmartClass Arena", appName)
  }

  @Test
  fun `verify friend challenge and selection logic`() {
    val context = ApplicationProvider.getApplicationContext<android.app.Application>()
    val viewModel = ArenaViewModel(context)

    val initialState = viewModel.uiState.value
    assertTrue("Friends list should not be empty", initialState.friendsList.isNotEmpty())

    // Sarah bot should be present and online
    val sarahBot = initialState.friendsList.find { it.isBot }
    assertNotNull("Sarah bot should be present", sarahBot)
    assertTrue("Sarah bot should be online", sarahBot!!.isOnline)

    // Test friend selection
    viewModel.selectFriend("friend-kweku")
    assertEquals("friend-kweku", viewModel.uiState.value.selectedFriendId)

    // Test search filter
    viewModel.setFriendSearchQuery("Dubai")
    assertEquals("Dubai", viewModel.uiState.value.friendSearchQuery)

    // Test challenge configuration
    viewModel.setChallengeQuestionCount(10)
    assertEquals(10, viewModel.uiState.value.selectedQuestionCount)

    viewModel.setChallengeTimeLimit(30)
    assertEquals(30, viewModel.uiState.value.selectedTimeLimitSeconds)
  }

  @Test
  fun `verify school battle rankings and rival selection logic`() {
    val context = ApplicationProvider.getApplicationContext<android.app.Application>()
    val viewModel = ArenaViewModel(context)

    val state = viewModel.uiState.value
    assertTrue("School rankings should not be empty", state.schoolRankings.isNotEmpty())

    // Check user's school is identified
    val mySchool = state.schoolRankings.find { it.isMySchool }
    assertNotNull("User school should be present in rankings", mySchool)

    // Select rival school
    viewModel.selectRivalSchool("dubai-college")
    assertEquals("dubai-college", viewModel.uiState.value.selectedRivalSchoolId)

    // Filter by country tab
    viewModel.setSelectedSchoolTab("UAE")
    assertEquals("UAE", viewModel.uiState.value.selectedSchoolTab)

    // Filter by search query
    viewModel.setSchoolSearchQuery("Achimota")
    assertEquals("Achimota", viewModel.uiState.value.schoolSearchQuery)

    // Check School Battle arena mode is defined
    assertEquals("School Battle", ArenaMode.SCHOOL_BATTLE.title)
    assertEquals("school", ArenaMode.SCHOOL_BATTLE.iconName)
  }

  @Test
  fun `verify tournament championship tabs registration and bracket visualization`() {
    val context = ApplicationProvider.getApplicationContext<android.app.Application>()
    val viewModel = ArenaViewModel(context)

    val state = viewModel.uiState.value
    assertTrue("Tournaments list should not be empty", state.tournamentsList.isNotEmpty())

    // Check tabs switching
    viewModel.setSelectedTournamentTab("active")
    assertEquals("active", viewModel.uiState.value.selectedTournamentTab)

    // Check tournament registration
    val mathCup = state.tournamentsList.first { it.id == "t1" }
    val initialParticipants = mathCup.participants
    viewModel.registerForTournament("t1")
    val updatedMathCup = viewModel.uiState.value.tournamentsList.first { it.id == "t1" }
    assertTrue(updatedMathCup.isRegistered)
    assertEquals(initialParticipants + 1, updatedMathCup.participants)

    // Check bracket selection
    viewModel.selectTournament("t2")
    assertEquals("t2", viewModel.uiState.value.selectedTournamentId)
    assertTrue(viewModel.uiState.value.isViewingBracket)

    val scienceCup = viewModel.uiState.value.tournamentsList.first { it.id == "t2" }
    assertTrue("Science Cup must have bracket rounds", scienceCup.rounds.isNotEmpty())
    assertEquals("Quarter Finals", scienceCup.rounds.first().name)

    // Close bracket view
    viewModel.closeBracketView()
    assertFalse(viewModel.uiState.value.isViewingBracket)
  }

  @Test
  fun `verify auth identity and student profile update logic`() {
    val context = ApplicationProvider.getApplicationContext<android.app.Application>()
    val viewModel = ArenaViewModel(context)

    // Test opening and closing auth dialog
    assertFalse(viewModel.uiState.value.isAuthDialogOpen)
    viewModel.openAuthDialog()
    assertTrue(viewModel.uiState.value.isAuthDialogOpen)
    viewModel.closeAuthDialog()
    assertFalse(viewModel.uiState.value.isAuthDialogOpen)

    // Test updating student details
    viewModel.updateStudentProfileDetails(
      name = "Ukasha Al-Mansoor",
      school = "SmartClass International, Dubai",
      gradeLevel = "SHS 2",
      region = "UAE"
    )

    val updatedProfile = viewModel.uiState.value.userProfile
    assertEquals("Ukasha Al-Mansoor", updatedProfile.name)
    assertEquals("SmartClass International, Dubai", updatedProfile.school)
    assertEquals("SHS 2", updatedProfile.gradeLevel)
    assertEquals("UAE", updatedProfile.selectedRegion)
  }

  @Test
  fun `verify student profile auth dialog state`() {
    val context = ApplicationProvider.getApplicationContext<android.app.Application>()
    val viewModel = ArenaViewModel(context)

    // Test opening and closing student auth dialog
    assertFalse(viewModel.uiState.value.isAuthDialogOpen)
    viewModel.openAuthDialog()
    assertTrue(viewModel.uiState.value.isAuthDialogOpen)
    viewModel.closeAuthDialog()
    assertFalse(viewModel.uiState.value.isAuthDialogOpen)

    // Verify student profile details
    val profile = viewModel.uiState.value.userProfile
    assertTrue(profile.name.isNotBlank())
    assertTrue(profile.school.isNotBlank())
  }
}
