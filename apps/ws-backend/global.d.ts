import * as ws from "ws";
import { role } from "@repo/db/db"

declare module "ws" {
  export interface WebSocket {
    user: {
      userId: string; 
      role: role;
    };
  }
}
