import { prisma } from "@repo/db/db";
import { getClassSchema } from "@repo/types/types";
import { responsePlate, zodErrorMessage } from "@repo/utils/utils";
import type { Request, Response } from "express";

export const startClassRequest = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { data, success, error } = getClassSchema.safeParse({ classId: id });

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

    const { classId } = data;

    const exisitingClass = await prisma.class.findFirst({
      where: {
        id: classId,
      },
    });

    if (!exisitingClass) {
      return responsePlate({
        res,
        message: "class not found",
        status: 404,
        apiRes: {
          success: false,
          error: "class not found",
        },
      });
    }

    if (exisitingClass.teacherId !== userId) {
      return responsePlate({
        res,
        message: "class not found",
        status: 404,
        apiRes: {
          success: false,
          error: "class not found",
        },
      });
    }

    const updatedClass = await prisma.class.update({
      where: {
        id: exisitingClass.id,
      },
      data: {
        startedAt: new Date(),
      },
    });

    return responsePlate({
      res,
      message: "class successfull started",
      status: 201,
      apiRes: {
        success: true,
        data: {
          classId: updatedClass.id,
          startedAt: updatedClass.startedAt?.toISOString(),
        },
      },
    });
  } catch (e) {
    console.log("error in startClassRequest ", e);
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
