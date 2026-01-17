/**
 * Script to clean up test/demo users from Firestore
 * Run this with: node cleanup-test-users.js
 * 
 * PREREQUISITES:
 * 1. npm install firebase-admin
 * 2. Download serviceAccountKey.json from Firebase Console
 * 3. Place serviceAccountKey.json in project root (same folder as this script)
 * 
 * SECURITY: serviceAccountKey.json is in .gitignore - NEVER commit it!
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Safely load service account key
const keyPath = path.join(__dirname, 'serviceAccountKey.json');

// Check if service account key exists
if (!fs.existsSync(keyPath)) {
  console.error('❌ ERROR: serviceAccountKey.json not found!\n');
  console.log('📝 To fix this:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.log('2. Select your project');
  console.log('3. Click ⚙️ → Project Settings → Service Accounts');
  console.log('4. Click "Generate New Private Key"');
  console.log('5. Save as "serviceAccountKey.json" in project root\n');
  process.exit(1);
}

const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin SDK initialized successfully\n');
} catch (error) {
  console.error('❌ ERROR: Failed to initialize Firebase Admin SDK:', error.message);
  process.exit(1);
}

const db = admin.firestore();

const TEST_USER_PATTERNS = [
  /test/i,
  /demo/i,
  /sample/i,
  /fake/i,
  /anon-/i, // Anonymous users
  /Sarah K\./i,
  /Michael A\./i,
  /Emma T\./i,
  /David L\./i,
  /Olivia M\./i,
  /James P\./i,
];

async function cleanupTestUsers() {
  console.log('🔍 Scanning for test users...\n');
  
  try {
    const studentsRef = db.collection('students');
    const snapshot = await studentsRef.get();
    
    const usersToDelete = [];
    const realUsers = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const userName = data.studentName || data.userName || '';
      const email = data.email || '';
      
      // Check if user matches test patterns
      const isTestUser = TEST_USER_PATTERNS.some(pattern => 
        pattern.test(userName) || pattern.test(email)
      );
      
      if (isTestUser) {
        usersToDelete.push({
          id: doc.id,
          name: userName,
          email: email
        });
      } else {
        realUsers.push({
          id: doc.id,
          name: userName,
          email: email
        });
      }
    });
    
    console.log(`📊 Found ${realUsers.length} real users and ${usersToDelete.length} test users\n`);
    
    if (usersToDelete.length === 0) {
      console.log('✅ No test users to delete!');
      return;
    }
    
    console.log('🗑️  Test users to be deleted:');
    usersToDelete.forEach(user => {
      console.log(`  - ${user.name} (${user.email || 'no email'}) [${user.id}]`);
    });
    
    console.log('\n⚠️  WARNING: This will permanently delete these users!');
    console.log('💡 To proceed, uncomment the deletion code below and run again.\n');
    
    // UNCOMMENT THE CODE BELOW TO ACTUALLY DELETE THE USERS
    // console.log('\n🔥 Deleting test users...');
    // const batch = db.batch();
    // usersToDelete.forEach(user => {
    //   const docRef = studentsRef.doc(user.id);
    //   batch.delete(docRef);
    // });
    // await batch.commit();
    // console.log(`✅ Successfully deleted ${usersToDelete.length} test users!`);
    
    console.log('\n👥 Real users remaining:');
    realUsers.forEach(user => {
      console.log(`  - ${user.name} ${user.email ? '(' + user.email + ')' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

cleanupTestUsers();
