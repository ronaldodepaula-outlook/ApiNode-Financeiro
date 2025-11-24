// Migration script: remove `empresa_id` field from Papel documents and drop index if present
// Usage: set MONGO_URI in environment or in .env, then run:
// node scripts/migrate/remove_papel_empresa.js

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI not set in environment. Set it in .env or as environment variable.');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Candidate collection names for Papel (Mongoose pluralization may vary)
    const candidates = ['papeis', 'papels', 'papel', 'papels'];
    let target = null;

    const existing = await db.listCollections().toArray();
    const existingNames = existing.map(c => c.name);
    for (const c of candidates) {
      if (existingNames.includes(c)) {
        target = c;
        break;
      }
    }

    if (!target) {
      console.warn('Warning: could not find a collection matching common Papel names. Available collections:');
      console.warn(existingNames.join(', '));
      console.warn('Trying default Mongoose pluralization `papeis` anyway.');
      target = 'papeis';
    }

    const collection = db.collection(target);

    // 1) Unset empresa_id field
    const unsetResult = await collection.updateMany({}, { $unset: { empresa_id: '' } });
    console.log(`Unset empresa_id on collection '${target}': matched=${unsetResult.matchedCount}, modified=${unsetResult.modifiedCount}`);

    // 2) Drop index on empresa_id if exists
    try {
      const indexes = await collection.indexes();
      const idx = indexes.find(i => i.key && i.key.empresa_id === 1);
      if (idx) {
        const name = idx.name;
        await collection.dropIndex(name);
        console.log(`Dropped index '${name}' on collection '${target}'`);
      } else {
        console.log('No index on empresa_id found; nothing to drop.');
      }
    } catch (err) {
      console.warn('Could not inspect/drop index:', err.message);
    }

    console.log('Migration completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

run();
