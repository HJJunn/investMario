import { openDB, deleteDB  } from 'idb';

export async function getDB() {
  try {
    const db = await openDB("DB", 1, {
      upgrade(db) {
        const stores = ["trade"];
        for (const storeName of stores) {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { autoIncrement: true });

       
            store.add({ time: undefined, data: undefined }, 1); 
          }
        }
      },
    });
    return db;
  } catch (err) {
    console.warn("DB 열기 실패, 삭제 후 재시도:", err);
 
    await deleteDB("DB");

    const db = await openDB("DB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("trade")) {
          db.createObjectStore("trade");
        }
      },
    });
    return db;
  }
}

export async function saveUpdate(storeName, updateNumber, data) {
  try{
    const db = await getDB();
    const tx = db.transaction(storeName, "readwrite");
    await tx.objectStore(storeName).put(data, updateNumber);
    await tx.done;
    return true;
  }
  catch {
    return false;
  }
}

export async function loadUpdate(storeName, updateNumber) {
  const db = await getDB();
  const tx = db.transaction(storeName, "readonly");
  const data = await tx.objectStore(storeName).get(updateNumber);
  await tx.done;
  return data;
}

export async function clearStore(storeName, updateNumber) {
  try{
    const db = await getDB();
    const tx = db.transaction(storeName, "readwrite");
    await tx.objectStore(storeName).delete(updateNumber); // 특정 key 삭제
    await tx.done;
    return true;
  }catch{
    return false;
  }
}