import type { Request, Response } from "express";
import { responsePlate, zodErrorMessage } from "@repo/utils/utils";
import { signupSchema } from "@repo/types/types";
import { prisma } from "@repo/db/db";
import { hash } from "bcryptjs";

export const signupRequest = async (req: Request, res: Response) => {
  try {
    const { data, success, error } = signupSchema.safeParse(req.body);

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

    const { email, name, password, role } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return responsePlate({
        res,
        apiRes: {
          success: false,
          error: "user already exists with this email",
        },
        message: "user already exists with this email",
        status: 400,
      });
    }

    const hasedPassword = await hash(password, 4);

    await prisma.user
      .create({
        data: {
          email,
          name,
          password: hasedPassword,
          role,
        },
      })
      .then((data) => {
        return responsePlate({
          res,
          message: "user created successfully",
          status: 201,
          apiRes: {
            success: true,
            data: {
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role,
            },
          },
        });
      })
      .catch((e) => {
        return responsePlate({
          res,
          message: "database error",
          status: 503,
          apiRes: {
            success: false,
            error: e,
          },
        });
      });
  } catch (e) {
    console.log("error in signupRequest ", e);
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
