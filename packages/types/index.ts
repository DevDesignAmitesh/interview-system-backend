import z from "zod";

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6, "password should be atleast 6 letters"),
  role: z.enum(["student", "teacher"]),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "password should be atleast 6 letters"),
});

export const createClassSchema = z.object({
  className: z.string(),
});

export const addStudentSchema = z.object({
  studentId: z.uuid(),
  classId: z.uuid(),
});

export const getClassSchema = z.object({
  classId: z.uuid(),
});
