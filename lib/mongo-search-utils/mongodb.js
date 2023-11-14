import { MongoClient } from 'mongodb';

//Create mongo client
const uri = process.env.MONGO_URI_CONNECTION;

let client;
let clientPromise;

if (!process.env.MONGO_URI_CONNECTION) {
  throw new Error('Add Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

/* replaceOne or insert pages */
export async function updatePagesCollection({
  recordArray,
  database,
  collectionName,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await clientPromise;
      const db = client.db(database);
      const collection = await db.collection(collectionName);

      //delete all collection documents
      const deleteStatus = await collection.deleteMany({});
      if (
        !deleteStatus ||
        (deleteStatus?.deletedCount && deleteStatus?.deletedCount < 1)
      ) {
        throw new Error(
          'Error occured when attempting to clear the pages collection',
        );
      }
      //insert all page documents
      const insertStatus = await collection.insertMany(recordArray);
      if (
        !insertStatus ||
        (insertStatus?.insertedCount && insertStatus?.insertedCount < 1)
      ) {
        throw new Error(
          'Error occured when attempting to insert multiple page documents into pages collection',
        );
      }
      resolve(insertStatus.insertedCount);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

//NOTE - "DNS module not found error" will occur if clientPromise is imported and not used i.e. commented out
//updatePagesCollection function uses clientPromise directly in its local scope, possible issue?
export default clientPromise;
