import Dexie from 'dexie';

export const db = new Dexie('TodoDB');
db.version(1).stores({ todos: '++id, task, completed, date' });