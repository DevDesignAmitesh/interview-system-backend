import type { Request, Response } from "express";
import {
  generateToken,
  responsePlate,
  zodErrorMessage,
} from "@repo/utils/utils";
import { loginSchema } from "@repo/types/types";
import { prisma } from "@repo/db/db";
import { compare } from "bcryptjs";

export const loginRequest = async (req: Request, res: Response) => {
  try {
    const { data, success, error } = loginSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        apiRes: {
          success: false,
          error: zodErrorMessage({ error }),
        },
        message: "invalid inputs",
        status: 411,
      });
    }

    const { email, password } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return responsePlate({
        res,
        apiRes: {
          success: false,
          error: "user doesnot exits with this email",
        },
        message: "user doesnot exits with this email",
        status: 400,
      });
    }

    const isPasswordValid = compare(password, existingUser.password);

    if (!isPasswordValid) {
      return responsePlate({
        res,
        message: "wrong password",
        status: 400,
        apiRes: {
          success: false,
          error: "wrong password",
        },
      });
    }

    const token = generateToken({
      userId: existingUser.id,
      role: existingUser.role,
    });

    return responsePlate({
      res,
      message: "user login successfully",
      status: 201,
      apiRes: {
        success: true,
        data: {
          token,
        },
      },
    });
  } catch (e) {
    console.log("error in loginRequest ", e);
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
