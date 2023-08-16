import { CloudAdapter } from "botbuilder";
import { onTurnErrorHandler } from "../utils/turnErrorHandler.js";
import { botFrameworkAuthentication } from "../adapter.js";
import bot from "../bot.js";

const upgradeController = async (req, socket, head) => {
  const streamingAdapter = new CloudAdapter(botFrameworkAuthentication);

  streamingAdapter.onTurnError = onTurnErrorHandler;

  await streamingAdapter.process(req, socket, head, (context) =>
    bot.run(context)
  );
};

export { upgradeController };
