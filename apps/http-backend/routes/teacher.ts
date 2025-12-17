import { Router } from "express";
import { createClassRequest } from "../services/teacher/create-class";
import { teacherMiddleware } from "../middleware/teacher";
import { addStudentRequest } from "../services/teacher/add-student";
import { getStudentRequest } from "../services/teacher/get-student";
import { startClassRequest } from "../services/teacher/start-class";

export const teacherRouter = Router();

teacherRouter.post("/class", teacherMiddleware, createClassRequest);
teacherRouter.post("/start/:id", teacherMiddleware, startClassRequest);
teacherRouter.get("/students", teacherMiddleware, getStudentRequest);
teacherRouter.post(
  "/class/:id/add-student",
  teacherMiddleware,
  addStudentRequest
);
