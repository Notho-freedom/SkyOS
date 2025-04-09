import Dexie from "dexie";

const db = new Dexie("SkyOS_IA_DB");
db.version(1).stores({
  history: '++id,role,content'
});

export default db;