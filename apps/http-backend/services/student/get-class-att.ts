import { prisma } from "@repo/db/db";
import { getClassSchema } from "@repo/types/types";
import { responsePlate, zodErrorMessage } from "@repo/utils/utils";
import type { Request, Response } from "express";

export const getAttendance = async (req: Request, res: Response) => {
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

    const findClass = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        studentIds: true,
        attendance: true,
      },
    });

    if (!findClass) {
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

    const isUserPresent = findClass.attendance.find(
      (std) => std.studentId === userId
    );

    if (!isUserPresent) {
      return responsePlate({
        res,
        message: "class found",
        status: 200,
        apiRes: {
          success: true,
          data: {
            classId,
            status: null,
          },
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
          classId,
          status: "present",
        },
      },
    });
  } catch (e) {
    console.log("error in getAttendance ", e);
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
