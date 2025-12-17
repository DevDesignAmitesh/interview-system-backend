import { prisma } from "@repo/db/db";
import { addStudentSchema } from "@repo/types/types";
import { responsePlate, zodErrorMessage } from "@repo/utils/utils";
import type { Request, Response } from "express";

export const addStudentRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { success, data, error } = addStudentSchema.safeParse({
      ...req.body,
      classId: id,
    });

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

    const { classId, studentId } = data;

    const isClassExists = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        studentIds: true,
      },
    });

    if (!isClassExists) {
      return responsePlate({
        res,
        message: "class with this id not found",
        status: 404,
        apiRes: {
          success: false,
          error: "class with this id not found",
        },
      });
    }

    const isStudentAlreadyIncluded = await prisma.attendance.findFirst({
      where: {
        classId,
        studentId,
      },
    });

    if (isStudentAlreadyIncluded) {
      return responsePlate({
        res,
        message: "student is already in the class",
        status: 400,
        apiRes: {
          success: false,
          error: "student is alreay in the class",
        },
      });
    }

    const createdAttendence = await prisma.attendance.create({
      data: {
        classId,
        studentId,
      },
      include: {
        class: {
          include: {
            studentIds: true,
          },
        },
      },
    });

    return responsePlate({
      res,
      message: "attendance added successfully",
      status: 201,
      apiRes: {
        success: true,
        data: {
          id: createdAttendence.classId,
          teacherId: createdAttendence.class.teacherId,
          studentIds: createdAttendence.class.studentIds.map((std) => std.id),
        },
      },
    });
  } catch (e) {
    console.log("error in addStudentRequest ", e);
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
