
// indexDB configuration
const DB_NAME = 'QuickScribeDB';
const DB_VERSION = 1;
export const PROJECTS_STORE = 'projects';
export const NOTES_STORE = 'notes';
export const TAGS_STORE = 'tags';
export const TODOS_STORE = 'todos';

export const initDB = (): Promise<IDBDatabase> => {

    return new Promise((resolve, reject) => {
    
        const request = indexedDB.open(DB_NAME,DB_VERSION)

        request.onerror = () => reject(request.error)

        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {

            const db = (event.target as IDBOpenDBRequest).result

            if(!db.objectStoreNames.contains(PROJECTS_STORE)) {
                db.createObjectStore(PROJECTS_STORE,{keyPath: 'id'})
            }

            if(!db.objectStoreNames.contains(NOTES_STORE)) {
                const notesStore = db.createObjectStore(NOTES_STORE,{keyPath: 'id'})
                notesStore.createIndex("project_id","project_id",{unique: false})
            }
            if(!db.objectStoreNames.contains(TAGS_STORE)) {
                const notesStore = db.createObjectStore(TAGS_STORE,{keyPath: 'id'})
                notesStore.createIndex("project_id","project_id",{unique: false})
            }
            if(!db.objectStoreNames.contains(TODOS_STORE)) {
                const notesStore = db.createObjectStore(TODOS_STORE,{keyPath: 'id'})
                notesStore.createIndex("project_id","project_id",{unique: false})
            }
        }
    })
}

export const getAllProjects = async ():Promise<Project[]> => {
    const db = await initDB()

    return new Promise((resolve,reject) => {
        const transaction = db.transaction(PROJECTS_STORE,"readonly")
        const store = transaction.objectStore(PROJECTS_STORE)

        const request = store.getAll()

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
    })
}

// the items can be todos or notes or tags
export const getItemsByProjectId = async(storeName: string, projectId: string | undefined): Promise<any[]> => {
    const db = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName,"readonly")
        const store = transaction.objectStore(storeName)

        const index = store.index('project_id')
        const request = index.getAll(projectId)

        request.onerror = () => reject(request.error) 
        request.onsuccess = () => resolve(request.result) 
    })
}

export const addItem = async(storeName: string,item: any): Promise<void> => {
    
    const db = await initDB()

    return new Promise((resolve,reject) => {
        const transaction = db.transaction(storeName,"readwrite")
        const store = transaction.objectStore(storeName)

        const request = store.add(item)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
    })
}

export const updateItem = async(storeName:string, item: any): Promise<void> => {
    const db = await initDB()

    return new Promise((resolve,reject) => {
        const transaction = db.transaction(storeName,"readwrite")
        const store = transaction.objectStore(storeName)

        const request = store.put(item)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
    })
}

export const deleteItem = async(storeName: string, id: string): Promise<void> => {

    const db = await initDB()

    return new Promise((resolve,reject) => {
        const transaction = db.transaction(storeName,"readwrite")
        const store = transaction.objectStore(storeName)

        const request = store.delete(id)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
    })
}
