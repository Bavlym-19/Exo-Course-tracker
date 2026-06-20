import { drizzle } from "drizzle-orm/mysql2";
import { students } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return;
  }

  const db = drizzle(process.env.DATABASE_URL);

  const employees = [
    { id: 1, name: "بافلي", role: "admin" as const, jobTitle: "Admin", level: "Senior Admin" },
    { id: 980, name: "أحمد يوسف", role: "student" as const, jobTitle: "Back-end Developer", level: "Intermediate" },
    { id: 960, name: "أروى توفيق", role: "student" as const, jobTitle: "Presentation Specialist", level: "Intermediate" },
    { id: 970, name: "جنى أحمد", role: "student" as const, jobTitle: "Front-end Developer", level: "Junior" },
    { id: 990, name: "جنى يوسف", role: "student" as const, jobTitle: "Hardware, Software, Planning & Development", level: "Senior" },
    { id: 950, name: "أمين", role: "student" as const, jobTitle: "UI/UX & Front-end Developer", level: "Senior" },
    { id: 940, name: "مورين عاطف", role: "student" as const, jobTitle: "Biomedical Engineering", level: "Junior" },
  ];

  console.log("Seeding employees...");

  for (const emp of employees) {
    try {
      // Check if exists
      const existing = await db.select().from(students).where(eq(students.id, emp.id)).limit(1);
      if (existing.length > 0) {
        console.log(`Updating ${emp.name} (ID: ${emp.id})`);
        await db.update(students).set(emp).where(eq(students.id, emp.id));
      } else {
        console.log(`Inserting ${emp.name} (ID: ${emp.id})`);
        await db.insert(students).values(emp);
      }
    } catch (err) {
      console.error(`Failed to seed ${emp.name}:`, err);
    }
  }

  console.log("Seeding completed!");
  process.exit(0);
}

seed();
