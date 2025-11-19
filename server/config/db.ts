import { MongoClient, Db } from 'mongodb';

// MongoDB connection string - database name is specified in the connection string
const MONGODB_URI = 'mongodb+srv://dhakacollection7_db_user:jygKryBIhdNhls8y@auraportfolio.54fkobm.mongodb.net/?appName=Auraportfolio';
// Extract database name from URI or use default
const DB_NAME = 'auraportfolio';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    
    // Verify connection by listing collections
    const collections = await db.listCollections().toArray();
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${DB_NAME}`);
    console.log(`📁 Existing collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None (will be created on first insert)'}`);
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

