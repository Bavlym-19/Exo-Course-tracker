import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, float, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Students table - stores student information with numeric access codes
export const students = mysqlTable("students", {
  id: int("id").primaryKey(),
  name: text("name").notNull(),
  courseLink: text("courseLink"),
  role: mysqlEnum("role", ["student", "admin"]).default("student").notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

// Screenshots table - stores uploaded course progress screenshots
export const screenshots = mysqlTable("screenshots", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  analyzedPercentage: float("analyzedPercentage"),
  lastSection: text("lastSection"),
  remainingPercentage: float("remainingPercentage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Screenshot = typeof screenshots.$inferSelect;
export type InsertScreenshot = typeof screenshots.$inferInsert;

// Progress logs table - stores session-by-session progress
export const progressLogs = mysqlTable("progressLogs", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  sectionReached: text("sectionReached"),
  percentageComplete: float("percentageComplete").notNull(),
  percentageRemaining: float("percentageRemaining").notNull(),
  screenshotId: int("screenshotId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProgressLog = typeof progressLogs.$inferSelect;
export type InsertProgressLog = typeof progressLogs.$inferInsert;

// Quiz attempts table - stores quiz results and scoring
export const quizAttempts = mysqlTable("quizAttempts", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  progressLogId: int("progressLogId"),
  questions: json("questions").$type<Array<{id: string; question: string; options: string[]; correctAnswer: string}>>(),
  answers: json("answers").$type<Record<string, string>>(),
  score: float("score").notNull(),
  passed: int("passed").notNull(),
  cumulativeUnderstanding: float("cumulativeUnderstanding").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;