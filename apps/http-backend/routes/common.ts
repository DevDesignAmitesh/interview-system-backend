import { Router } from "express";
import { commonMiddleware } from "../middleware/common";
import { getClassRequest } from "../services/common/get-class";

export const commonRouter = Router();

commonRouter.get("/class/:id", commonMiddleware, getClassRequest);
