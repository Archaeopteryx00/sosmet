import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'sosmet-image-db';
const STORE_NAME = 'uploaded-images';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      }
    });
  }
  return dbPromise;
}

export async function saveImageToStorage(id: string, base64Data: string): Promise<string> {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, base64Data, id);
    return id; // return storage ID
  } catch (e) {
    console.warn('IndexedDB save failed, returning raw base64:', e);
    return base64Data;
  }
}

export async function getImageFromStorage(id: string): Promise<string | null> {
  if (!id.startsWith('img_id_')) {
    return id; // It's already a URL or base64
  }
  try {
    const db = await getDB();
    const result = await db.get(STORE_NAME, id);
    return result || null;
  } catch (e) {
    console.warn('IndexedDB get failed:', e);
    return null;
  }
}
