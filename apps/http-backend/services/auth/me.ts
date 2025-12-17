import type { Request, Response } from "express";
import {
  responsePlate,
} from "@repo/utils/utils";
import { prisma } from "@repo/db/db";

export const meRequest = async (req: Request, res: Response) => {
  try {
    const { role, userId } = req.user;

    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        role,
      },
    });

    if (!existingUser) {
      return responsePlate({
        res,
        message: "user not found",
        status: 401,
        apiRes: {
          success: false,
          error: "user not found",
        },
      });
    }

    return responsePlate({
      res,
      message: "user me successfully",
      status: 201,
      apiRes: {
        success: true,
        data: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      },
    });
  } catch (e) {
    console.log("error in meRequest ", e);
    return responsePlate({
      res,
      apiRes: {
        success: false,
        error: e,
      },
      message: "internal server error",
      status: 500,
    });
  }
};
