import { connectToDatabase, getDatabase, closeDatabase } from './config/db';

async function createMissingCollections() {
  try {
    console.log('🔍 Creating missing collections...\n');
    
    await connectToDatabase();
    const db = getDatabase();
    
    const requiredCollections = ['messages', 'newsletter'];
    
    for (const collectionName of requiredCollections) {
      const exists = await db.listCollections({ name: collectionName }).hasNext();
      
      if (!exists) {
        // Create collection by inserting and deleting a dummy document
        await db.collection(collectionName).insertOne({ _temp: true, createdAt: new Date().toISOString() });
        await db.collection(collectionName).deleteOne({ _temp: true });
        console.log(`✅ Created collection: ${collectionName}`);
      } else {
        const count = await db.collection(collectionName).countDocuments();
        console.log(`✅ Collection ${collectionName} already exists (${count} documents)`);
      }
    }
    
    console.log('\n🎉 All collections verified!');
    
  } catch (error) {
    console.error('❌ Error creating collections:', error);
  } finally {
    await closeDatabase();
    process.exit(0);
  }
}

createMissingCollections();

