import { responsePlate, verifyToken } from "@repo/utils/utils";
import type { NextFunction, Request, Response } from "express";

export const teacherMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return responsePlate({
        res,
        apiRes: {
          success: false,
          error: "token not found",
        },
        message: "token not found",
        status: 401,
      });
    }

    const decoded = verifyToken({ token });

    if (decoded.role !== "teacher") {
      return responsePlate({
        res,
        apiRes: {
          success: false,
          error: "Forbidden, teacher access required",
        },
        message: "Forbidden, teacher access required",
        status: 403,
      });
    }

    req.user = decoded;
    next();
  } catch (e) {
    console.log("error in teacher middleware ", e);
    return responsePlate({
      res,
      apiRes: {
        success: false,
        error: e,
      },
      message: "internal server erorr",
      status: 500,
    });
  }
};
