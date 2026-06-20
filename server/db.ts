import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users, progressLogs, quizAttempts, screenshots, students } from "../drizzle/schema"; // اتأكد إن مسار السكيم صحيح عندك

if (!process.env.DATABASE_URL) {
  throw new Error("[Database] DATABASE_URL is missing in environment variables");
}

// إنشاء اتصال بـ MySQL
const connection = await mysql.createConnection(process.env.DATABASE_URL);
export const db = drizzle(connection);

// تصدير الدوال الأساسية بنفس الأسماء للـ تتبع
import { eq } from "drizzle-orm";
import { InsertUser, InsertProgressLog, InsertQuizAttempt, InsertScreenshot } from "../drizzle/schema";
import { ENV } from './_core/env';

export async function getDb() {
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    textFields.forEach(field => {
      if (user[field] !== undefined) {
        values[field] = user[field] ?? null;
        updateSet[field] = user[field] ?? null;
      }
    });
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getStudentById(id: number) {
  const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllStudents() {
  return db.select().from(students);
}

export async function getStudentProgressLogs(studentId: number) {
  return db.select().from(progressLogs).where(eq(progressLogs.studentId, studentId));
}

export async function createProgressLog(data: InsertProgressLog) {
  return db.insert(progressLogs).values(data);
}

export async function getStudentQuizAttempts(studentId: number) {
  return db.select().from(quizAttempts).where(eq(quizAttempts.studentId, studentId));
}

export async function createQuizAttempt(data: InsertQuizAttempt) {
  return db.insert(quizAttempts).values(data);
}

export async function createScreenshot(data: InsertScreenshot) {
  return db.insert(screenshots).values(data);
}

export async function getStudentScreenshots(studentId: number) {
  return db.select().from(screenshots).where(eq(screenshots.studentId, studentId));
}
