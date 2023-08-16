import adapter from "../adapter.js";
import bot from "../bot.js";

const messageController = async (req, res) => {
  await adapter.process(req, res, (context) => bot.run(context));
};

export { messageController };
