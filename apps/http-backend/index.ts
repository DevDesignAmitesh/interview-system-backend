import express from "express";
import { authRouter } from "./routes/auth";
import { teacherRouter } from "./routes/teacher";
import { commonRouter } from "./routes/common";
import { studentRouter } from "./routes/student";

export const app = express();
export const PORT = 4000;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);
app.use("/common", commonRouter);
