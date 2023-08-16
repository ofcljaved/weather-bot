import { upgradeController } from "../controllers/upgradeControlller.js";

export default function (server) {
  server.on("upgrade", upgradeController);
}
