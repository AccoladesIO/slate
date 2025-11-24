const DB_NAME = "SlateDB";
const DB_VERSION = 1;
const STORE_NAME = "presentations";

let dbInstance = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

export const saveToIndexedDB = async (presentationId, data) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const payload = {
      id: presentationId,
      title: data.title,
      description: data.description,
      editorData: data.editor,
      excalidrawData: data.excalidraw,
      updatedAt: new Date().toISOString(),
    };

    await store.put(payload);
    return true;
  } catch (error) {
    console.error("Failed to save to IndexedDB:", error);
    return false;
  }
};

export const loadFromIndexedDB = async (presentationId) => {
  console.log("LOAD KEY:", presentationId);
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(presentationId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to load from IndexedDB:", error);
    return null;
  }
};

export const deleteFromIndexedDB = async (presentationId) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    await store.delete(presentationId);
    return true;
  } catch (error) {
    console.error("Failed to delete from IndexedDB:", error);
    return false;
  }
};

export const clearIndexedDB = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    await store.clear();
    return true;
  } catch (error) {
    console.error("Failed to clear IndexedDB:", error);
    return false;
  }
};