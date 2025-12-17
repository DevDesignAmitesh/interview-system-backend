import { type Response } from "express";
import { sign, verify } from "jsonwebtoken";
import type { role } from "@repo/db/db";
import { ZodError } from "zod";
import { WebSocket } from "ws";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not found");
}

type response =
  | {
      success: false;
      error: any;
    }
  | {
      success: true;
      data: any;
    };

export const responsePlate = ({
  res,
  apiRes,
  status,
  message,
}: {
  res: Response;
  apiRes: response;
  status: number;
  message: string;
}) => {
  if (apiRes.success === false) {
    return res.status(status).json({
      success: apiRes.success,
      error: apiRes.error,
      message,
    });
  } else {
    return res.status(status).json({
      success: apiRes.success,
      data: apiRes.data,
      message,
    });
  }
};

export const verifyToken = ({ token }: { token: string }) => {
  return verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    role: role;
  };
};

export const generateToken = ({
  userId,
  role,
}: {
  userId: string;
  role: role;
}) => {
  return sign({ userId, role }, process.env.JWT_SECRET!);
};

export const zodErrorMessage = ({ error }: { error: ZodError }) => {
  return error.issues
    .map((er) => `${er.path.join(".")}: ${er.message}`)
    .join(", ");
};

export const websocketResponseTemplate = ({
  ws,
  event,
  data,
}: {
  ws: WebSocket;
  event: string;
  data: any;
}) => {
  ws.send(
    JSON.stringify({
      event,
      data,
    })
  );
};
