import { role } from "@repo/db/db"

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: role
      }
    }
  }
}