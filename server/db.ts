import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { InsertUser, users, InsertProgressLog, InsertQuizAttempt, InsertScreenshot, progressLogs, quizAttempts, screenshots, students } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db) {
    try {
      // إنشاء قاعدة بيانات SQLite محلية في ملف اسمه local.db
      const client = createClient({ url: "file:local.db" });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect to SQLite:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // تعديل لتتوافق مع SQLite (تغيير onDuplicateKeyUpdate إلى upsert)
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Student queries
export async function getStudentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllStudents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(students);
}

// Progress log queries
export async function getStudentProgressLogs(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(progressLogs).where(eq(progressLogs.studentId, studentId));
}

export async function createProgressLog(data: InsertProgressLog) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(progressLogs).values(data);
  return result;
}

// Quiz attempt queries
export async function getStudentQuizAttempts(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizAttempts).where(eq(quizAttempts.studentId, studentId));
}

export async function createQuizAttempt(data: InsertQuizAttempt) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(quizAttempts).values(data);
  return result;
}

// Screenshot queries
export async function createScreenshot(data: InsertScreenshot) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(screenshots).values(data);
  return result;
}

export async function getStudentScreenshots(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(screenshots).where(eq(screenshots.studentId, studentId));
}
