import { responsePlate, verifyToken } from "@repo/utils/utils";
import type { NextFunction, Request, Response } from "express";

export const studentMiddleware = (
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

    if (decoded.role !== "student") {
      return responsePlate({
        res,
        apiRes: {
          success: false,
          error: "Forbidden, student access required",
        },
        message: "Forbidden, student access required",
        status: 403,
      });
    }

    req.user = decoded;
    next();
  } catch (e) {
    console.log("error in student middleware ", e);
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
