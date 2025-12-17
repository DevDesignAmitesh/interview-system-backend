import { responsePlate, verifyToken } from "@repo/utils/utils";
import type { NextFunction, Request, Response } from "express";

export const commonMiddleware = (
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

    req.user = decoded;
    next()
  } catch (e) {
    console.log("error in common middleware ", e);
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
