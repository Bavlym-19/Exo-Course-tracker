import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getStudentById, getAllStudents, getStudentProgressLogs, getStudentQuizAttempts } from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    // Numeric code login for students
    loginWithCode: publicProcedure
      .input(z.object({ code: z.number().int() }))
      .mutation(async ({ input }) => {
        const student = await getStudentById(input.code);
        if (!student) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "كود الدخول غير صحيح",
          });
        }
        return {
          success: true,
          student: {
            id: student.id,
            name: student.name,
            role: student.role,
          },
        };
      }),
  }),

  student: router({
    getProfile: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        return getStudentById(input.studentId);
      }),
    getProgressLogs: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        return getStudentProgressLogs(input.studentId);
      }),
    getQuizAttempts: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        return getStudentQuizAttempts(input.studentId);
      }),
  }),

  admin: router({
    getAllStudents: publicProcedure.query(async () => {
      return getAllStudents();
    }),
  }),
});

export type AppRouter = typeof appRouter;
