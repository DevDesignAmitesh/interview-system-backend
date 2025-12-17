import { prisma } from "@repo/db/db";
import { createClassSchema } from "@repo/types/types";
import { responsePlate, zodErrorMessage } from "@repo/utils/utils";
import type { Request, Response } from "express";

export const createClassRequest = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { data, success, error } = createClassSchema.safeParse(req.body);

    if (!success) {
      return responsePlate({
        res,
        message: zodErrorMessage({ error }),
        status: 411,
        apiRes: {
          success: false,
          error: zodErrorMessage({ error }),
        },
      });
    }

    const { className } = data;

    const createdClass = await prisma.class.create({
      data: {
        className,
        teacherId: userId,
      },
      include: {
        studentIds: true,
      },
    });

    return responsePlate({
      res,
      message: "class created successfully",
      status: 201,
      apiRes: {
        success: true,
        data: {
          id: createdClass.id,
          className: createdClass.className,
          teacherId: createdClass.teacherId,
          studentIds: createdClass.studentIds.map((std) => std.id),
        },
      },
    });
  } catch (e) {
    console.log("error in createClassRequest ", e);
    return responsePlate({
      res,
      message: "internal server error",
      status: 500,
      apiRes: {
        success: false,
        error: "internal server error",
      },
    });
  }
};
