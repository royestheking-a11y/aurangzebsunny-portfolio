import { connectToDatabase, getDatabase, closeDatabase } from './config/db';

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying MongoDB database...\n');
    
    await connectToDatabase();
    const db = getDatabase();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    
    console.log(`📊 Database: auraportfolio`);
    console.log(`📁 Total Collections: ${collections.length}\n`);
    
    if (collections.length === 0) {
      console.log('⚠️  No collections found!');
      console.log('   Run: npm run init-db');
      return;
    }
    
    // Check each collection and count documents
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const count = await db.collection(collectionName).countDocuments();
      const sampleDoc = await db.collection(collectionName).findOne({});
      
      console.log(`📦 Collection: ${collectionName}`);
      console.log(`   Documents: ${count}`);
      if (sampleDoc) {
        console.log(`   Sample keys: ${Object.keys(sampleDoc).join(', ')}`);
      }
      console.log('');
    }
    
    // Summary
    console.log('✅ Database verification complete!');
    console.log(`\n📋 Collections found: ${collections.map(c => c.name).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error verifying database:', error);
  } finally {
    await closeDatabase();
    process.exit(0);
  }
}

verifyDatabase();

