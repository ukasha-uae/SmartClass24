/**
 * Data Migration Script: Add tenantId to Existing Documents
 * 
 * Adds tenantId='smartclass24' to all existing documents that don't have it.
 * Run this ONCE before deploying multi-tenant architecture.
 * 
 * @usage
 * ```bash
 * # Run from functions directory
 * cd functions
 * npm install
 * npx tsx src/migrate-add-tenant-id.ts
 * ```
 * 
 * @version 1.0.0
 */

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json not found!');
  console.error('Download it from Firebase Console → Project Settings → Service Accounts');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Default tenant for existing data
const DEFAULT_TENANT = 'smartclass24';

/**
 * Migrate a single collection
 */
async function migrateCollection(
  collectionName: string,
  subcollectionPath?: string
): Promise<void> {
  console.log(`\n📦 Migrating collection: ${collectionName}`);
  
  const startTime = Date.now();
  let processedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  
  try {
    // Get all documents in collection
    const query = subcollectionPath 
      ? db.collectionGroup(collectionName)
      : db.collection(collectionName);
    
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      console.log(`   ℹ️  No documents found in ${collectionName}`);
      return;
    }
    
    console.log(`   📊 Found ${snapshot.size} documents`);
    
    // Process in batches (Firestore limit: 500 writes per batch)
    const batchSize = 500;
    let batch = db.batch();
    let batchCount = 0;
    
    for (const doc of snapshot.docs) {
      processedCount++;
      
      const data = doc.data();
      
      // Skip if document already has tenantId
      if (data.tenantId) {
        console.log(`   ⏭️  Skipping ${doc.id} (already has tenantId: ${data.tenantId})`);
        continue;
      }
      
      // Add tenantId to document
      batch.update(doc.ref, {
        tenantId: DEFAULT_TENANT,
        migratedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      updatedCount++;
      batchCount++;
      
      // Commit batch if it reaches the limit
      if (batchCount >= batchSize) {
        await batch.commit();
        console.log(`   ✅ Committed batch of ${batchCount} updates`);
        batch = db.batch();
        batchCount = 0;
      }
    }
    
    // Commit remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(`   ✅ Committed final batch of ${batchCount} updates`);
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`\n   ✅ Migration complete for ${collectionName}`);
    console.log(`      - Processed: ${processedCount} documents`);
    console.log(`      - Updated: ${updatedCount} documents`);
    console.log(`      - Errors: ${errorCount}`);
    console.log(`      - Duration: ${duration}s`);
    
  } catch (error) {
    console.error(`\n   ❌ Error migrating ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Migrate per-user subcollections
 */
async function migrateUserSubcollections(
  subcollectionName: string
): Promise<void> {
  console.log(`\n📦 Migrating user subcollection: users/{userId}/${subcollectionName}`);
  
  const startTime = Date.now();
  let processedCount = 0;
  let updatedCount = 0;
  
  try {
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    
    console.log(`   📊 Found ${usersSnapshot.size} users`);
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // Get subcollection for this user
      const subcollectionSnapshot = await db
        .collection('users')
        .doc(userId)
        .collection(subcollectionName)
        .get();
      
      if (subcollectionSnapshot.empty) continue;
      
      const batch = db.batch();
      let batchCount = 0;
      
      for (const doc of subcollectionSnapshot.docs) {
        processedCount++;
        
        const data = doc.data();
        
        // Skip if document already has tenantId
        if (data.tenantId) continue;
        
        // Add tenantId to document
        batch.update(doc.ref, {
          tenantId: DEFAULT_TENANT,
          migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        updatedCount++;
        batchCount++;
      }
      
      if (batchCount > 0) {
        await batch.commit();
        console.log(`   ✅ Updated ${batchCount} documents for user ${userId}`);
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`\n   ✅ Migration complete for ${subcollectionName}`);
    console.log(`      - Processed: ${processedCount} documents`);
    console.log(`      - Updated: ${updatedCount} documents`);
    console.log(`      - Duration: ${duration}s`);
    
  } catch (error) {
    console.error(`\n   ❌ Error migrating ${subcollectionName}:`, error);
    throw error;
  }
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
  console.log('🚀 Starting multi-tenant data migration...\n');
  console.log(`   Default tenant: ${DEFAULT_TENANT}`);
  console.log(`   Timestamp: ${new Date().toISOString()}\n`);
  
  const overallStartTime = Date.now();
  
  try {
    // Migrate top-level collections
    await migrateCollection('students');
    await migrateCollection('challenges');
    await migrateCollection('subscriptions');
    await migrateCollection('referrals');
    await migrateCollection('university-progress');
    await migrateCollection('university-submissions');
    await migrateCollection('university-code-saves');
    
    // Migrate user subcollections
    await migrateUserSubcollections('quizAttempts');
    await migrateUserSubcollections('fcmTokens');
    await migrateUserSubcollections('notifications');
    
    const overallDuration = ((Date.now() - overallStartTime) / 1000).toFixed(2);
    
    console.log('\n🎉 Migration complete!');
    console.log(`   Total duration: ${overallDuration}s`);
    console.log('\n📋 Next steps:');
    console.log('   1. Review migration logs above');
    console.log('   2. Deploy new Firestore rules: firebase deploy --only firestore:rules');
    console.log('   3. Deploy Cloud Functions: firebase deploy --only functions');
    console.log('   4. Test with preview mode: ?tenant=wisdomwarehouse');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
