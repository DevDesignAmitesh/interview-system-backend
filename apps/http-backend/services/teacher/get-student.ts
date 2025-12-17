import { prisma } from "@repo/db/db";
import { responsePlate } from "@repo/utils/utils";
import type { Request, Response } from "express";

export const getStudentRequest = async (req: Request, res: Response) => {
  try {
    const students = await prisma.user.findMany();

    return responsePlate({
      res,
      message: "students found",
      status: 200,
      apiRes: {
        success: true,
        data: {
          students: students.filter((std) => std.role === "student"),
        },
      },
    });
  } catch (e) {
    console.log("error in getStudentRequest ", e);
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
