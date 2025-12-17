import { WebSocketServer } from "ws";
import { verifyToken, websocketResponseTemplate } from "@repo/utils/utils";
import { prisma } from "@repo/db/db";

const server = new WebSocketServer({ port: 8080 });

interface activeSessionProps {
  classId: string | null;
  startedAt: string | null;
  attendance: Record<string, "present" | null>;
}

const activeSession: activeSessionProps = {
  classId: null,
  startedAt: null,
  attendance: {},
};

server.on("connection", (ws, req) => {
  const token = req.url?.split("?token=")[1] ?? "";

  const decoded = verifyToken({ token });

  if (!decoded.userId) {
    ws.close();
    return;
  }

  ws.user = decoded;
  ws.on("open", () => console.log("connection done"));

  ws.on("error", (err) => console.log("error occured ", err));

  ws.on("message", async (data) => {
    if (!ws.user.userId) {
      ws.close();
      return;
    }

    const parsedData = JSON.parse(data.toString());

    if (parsedData.event === "ATTENDANCE_MARKED") {
      if (ws.user.role === "teacher") {
        const { studentId, status } = parsedData.data;

        activeSession.attendance[studentId] = status;

        server.clients.forEach((ws) => {
          websocketResponseTemplate({
            ws,
            event: parsedData.event,
            data: parsedData.data,
          });
        });

        return;
      }

      ws.close();
      return;
    }

    if (parsedData.event === "TODAY_SUMMARY") {
      if (ws.user.role === "teacher") {
        let classId = "";
        let present = 0;
        let absent = 0;
        let total = 0;
        for (const [key, value] of Object.entries(activeSession.attendance)) {
          classId = key;
          if (value === "present") {
            present++;
            total++;
          } else if (value === null) {
            absent++;
            total++;
          }
        }

        server.clients.forEach((ws) => {
          websocketResponseTemplate({
            ws,
            event: parsedData.event,
            data: {
              classId,
              present,
              absent,
              total,
            },
          });
        });
        return;
      }

      ws.close();
      return;
    }

    if (parsedData.event === "MY_ATTENDANCE") {
      if (ws.user.role !== "student") {
        ws.close();
        return;
      }

      const status = activeSession.attendance[ws.user.userId];

      if (status === "present") {
        websocketResponseTemplate({
          ws,
          event: parsedData.event,
          data: {
            status,
          },
        });
      }
      websocketResponseTemplate({
        ws,
        event: parsedData.event,
        data: {
          status: "not yet updated",
        },
      });
    }

    if (parsedData.event === "DONE") {
      if (ws.user.role !== "teacher") {
        ws.close();
        return;
      }

      const students = await prisma.class.findFirst({
        where: {
          id: activeSession.classId ?? "",
        },
        include: {
          studentIds: true,
        },
      });

      for (const [key, value] of Object.entries(activeSession.attendance)) {
        if (value !== "present") {
          
        }
      }
    }
  });
});


// fixing the classId thing that i am sending
// fixing the last DONE summary.
// testing all the endpoints ( hardest bit )