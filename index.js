import path from "path";
import { config } from "dotenv";
import restify from "restify";
import messageRoute from "./routes/messageRoute.js";
import upgradeRoute from "./routes/upgradeRoute.js";

const ENV_FILE = path.join(path.resolve(), ".env");
config({ path: ENV_FILE });

const server = restify.createServer();

//Using Middleware
server.use(restify.plugins.bodyParser());

//Using Routes
messageRoute(server);
upgradeRoute(server);

server.listen(process.env.PORT || 3978, () => {
  console.log(`${server.name} listening to ${server.url}`);
});
