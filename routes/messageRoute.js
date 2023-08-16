import { messageController } from "../controllers/messageController.js";

export default function messageRoute(server) {
  server.post("/api/messages", messageController);
}
