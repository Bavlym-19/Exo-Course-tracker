import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("auth.loginWithCode", () => {
  it("returns student info for valid code", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.loginWithCode({ code: 990 });

    expect(result.success).toBe(true);
    expect(result.student.id).toBe(990);
    expect(result.student.name).toBe("جنى يوسف");
    expect(result.student.role).toBe("student");
  });

  it("returns admin for code 1", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.loginWithCode({ code: 1 });

    expect(result.success).toBe(true);
    expect(result.student.id).toBe(1);
    expect(result.student.name).toBe("بافلي");
    expect(result.student.role).toBe("admin");
  });

  it("throws error for invalid code", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.loginWithCode({ code: 999 });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("NOT_FOUND");
      expect(error.message).toBe("كود الدخول غير صحيح");
    }
  });
});

describe("student.getProfile", () => {
  it("returns student profile by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.student.getProfile({ studentId: 980 });

    expect(result?.id).toBe(980);
    expect(result?.name).toBe("احمد يوسف");
    expect(result?.role).toBe("student");
  });

  it("returns undefined for non-existent student", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.student.getProfile({ studentId: 999 });

    expect(result).toBeUndefined();
  });
});

describe("admin.getAllStudents", () => {
  it("returns all students", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getAllStudents();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    
    const student990 = result.find(s => s.id === 990);
    expect(student990).toBeDefined();
    expect(student990?.name).toBe("جنى يوسف");
  });
});
