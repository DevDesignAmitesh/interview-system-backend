import { prisma } from "@repo/db/db";
import { getClassSchema } from "@repo/types/types";
import { responsePlate, zodErrorMessage } from "@repo/utils/utils";
import type { Request, Response } from "express";

export const getClassRequest = async (req: Request, res: Response) => {
  try {
    const { role, userId } = req.user;
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

    const existingClass = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        studentIds: true,
      },
    });

    if (!existingClass) {
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

    if (role === "student") {
      if (!existingClass.studentIds.map((std) => std.id).includes(userId)) {
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

      return responsePlate({
        res,
        message: "class found",
        status: 200,
        apiRes: {
          success: true,
          data: {
            id: existingClass.id,
            className: existingClass.className,
            teacherId: existingClass.teacherId,
            students: existingClass.studentIds,
          },
        },
      });
    } else if (role === "teacher") {
      if (existingClass.teacherId !== userId) {
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

      return responsePlate({
        res,
        message: "class found",
        status: 200,
        apiRes: {
          success: true,
          data: {
            id: existingClass.id,
            className: existingClass.className,
            teacherId: existingClass.teacherId,
            students: existingClass.studentIds,
          },
        },
      });
    }

    return responsePlate({
      res,
      message: "class not found",
      status: 404,
      apiRes: {
        success: false,
        error: "class not found",
      },
    });
  } catch (e) {
    console.log("error in getClassRequest ", e);
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
