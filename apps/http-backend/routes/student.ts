import { Router } from "express";
import { studentMiddleware } from "../middleware/student";
import { getAttendance } from "../services/student/get-class-att";

export const studentRouter = Router();

studentRouter.get("/class/:id/my-attendance", studentMiddleware, getAttendance)
