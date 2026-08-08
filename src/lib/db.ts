import Dexie, { Table } from 'dexie';
import { supabase, isSupabaseConfigured } from './supabase';

export interface SyncQueueItem {
  id?: number;
  table: string;
  action: 'insert' | 'update' | 'delete';
  recordId: string;
  data?: any;
  timestamp: string;
}

export class MomentumDatabase extends Dexie {
  tasks!: Table<any, string>;
  habits!: Table<any, string>;
  routines!: Table<any, string>;
  notes!: Table<any, string>;
  calendarEvents!: Table<any, string>;
  focusSessions!: Table<any, string>;
  courses!: Table<any, string>;
  assignments!: Table<any, string>;
  internships!: Table<any, string>;
  hackathons!: Table<any, string>;
  competitions!: Table<any, string>;
  researchPapers!: Table<any, string>;
  certifications!: Table<any, string>;
  goals!: Table<any, string>;
  achievements!: Table<any, string>;
  notifications!: Table<any, string>;
  projects!: Table<any, string>;
  profile!: Table<any, string>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super('MomentumOS_IndexedDB_v2');
    this.version(1).stores({
      tasks: 'id, status, priority, category, dueDate',
      habits: 'id, status, category, frequency',
      routines: 'id, targetTimeOfDay',
      notes: 'id, folder, updatedAt',
      calendarEvents: 'id, date, category',
      focusSessions: 'id, mode, timestamp',
      courses: 'id, code',
      assignments: 'id, courseId, status, dueDate',
      internships: 'id, status, company',
      hackathons: 'id, status, startDate',
      competitions: 'id, status, date',
      researchPapers: 'id, status, submissionDate',
      certifications: 'id, issueDate',
      goals: 'id, category, horizon',
      achievements: 'id, unlocked',
      notifications: 'id, read, type',
      projects: 'id',
      profile: 'id',
      syncQueue: '++id, table, action, timestamp',
    });
  }
}

export const db = new MomentumDatabase();

/**
 * Load all collections from Dexie IndexedDB
 */
export async function loadStateFromDexie() {
  try {
    const [
      tasks, habits, routines, notes, calendarEvents, focusSessions,
      courses, assignments, internships, hackathons, competitions,
      researchPapers, certifications, goals, achievements, notifications,
      projects, profileArr
    ] = await Promise.all([
      db.tasks.toArray(),
      db.habits.toArray(),
      db.routines.toArray(),
      db.notes.toArray(),
      db.calendarEvents.toArray(),
      db.focusSessions.toArray(),
      db.courses.toArray(),
      db.assignments.toArray(),
      db.internships.toArray(),
      db.hackathons.toArray(),
      db.competitions.toArray(),
      db.researchPapers.toArray(),
      db.certifications.toArray(),
      db.goals.toArray(),
      db.achievements.toArray(),
      db.notifications.toArray(),
      db.projects.toArray(),
      db.profile.toArray()
    ]);

    const profile = profileArr.length > 0 ? profileArr[0] : null;

    return {
      tasks, habits, routines, notes, calendarEvents, focusSessions,
      courses, assignments, internships, hackathons, competitions,
      researchPapers, certifications, goals, achievements, notifications,
      projects, profile
    };
  } catch (err) {
    console.error('Failed to load state from Dexie:', err);
    return null;
  }
}

/**
 * Save collection array to Dexie
 */
export async function saveCollectionToDexie(tableName: keyof MomentumDatabase, items: any[]) {
  try {
    const table = db[tableName] as Table<any, string>;
    if (!table) return;
    await table.clear();
    if (items.length > 0) {
      await table.bulkPut(items);
    }
  } catch (err) {
    console.error(`Failed saving collection ${tableName} to Dexie:`, err);
  }
}

/**
 * Queue an offline mutation for retry when online
 */
export async function queueOfflineMutation(table: string, action: 'insert' | 'update' | 'delete', recordId: string, data?: any) {
  try {
    await db.syncQueue.add({
      table,
      action,
      recordId,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to queue offline mutation:', err);
  }
}

/**
 * Sync offline queue to Supabase
 */
export async function processSyncQueue(userId: string) {
  if (!isSupabaseConfigured || !userId || !navigator.onLine) return;

  try {
    const items = await db.syncQueue.toArray();
    if (items.length === 0) return;

    for (const item of items) {
      const { table, action, recordId, data } = item;
      try {
        if (action === 'insert' || action === 'update') {
          await supabase.from(table).upsert({ ...data, user_id: userId, id: recordId });
        } else if (action === 'delete') {
          await supabase.from(table).delete().eq('id', recordId).eq('user_id', userId);
        }
        if (item.id) {
          await db.syncQueue.delete(item.id);
        }
      } catch (e) {
        console.error(`Error syncing queue item ${item.id}:`, e);
      }
    }
  } catch (err) {
    console.error('Error processing sync queue:', err);
  }
}
