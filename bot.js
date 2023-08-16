import {
  ActivityHandler,
  ConversationState,
  MemoryStorage,
  MessageFactory,
  UserState,
} from "botbuilder";
import WeatherDialog from "./componentDialogs/weatherDialog.js";

const WELCOMED_USER = "welcomedUserProperty";
const DIALOG_STATE = "dialogState";
const PREVIOUS_INTENT = "previousIntent";
const CONVERSATION_DATA = "conversationData";

class DemoBot extends ActivityHandler {
  constructor(conversationState, userState) {
    super();

    this.conversationState = conversationState;
    this.userState = userState;

    this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);
    this.dialogState = conversationState.createProperty(DIALOG_STATE);
    this.previousIntent = conversationState.createProperty(PREVIOUS_INTENT);
    this.conversationData = conversationState.createProperty(CONVERSATION_DATA);

    this.weatherDialog = new WeatherDialog(
      this.conversationState,
      this.userState
    );

    this.onMessage(async (context, next) => {
      const didBotWelcomedUser = await this.welcomedUserProperty.get(
        context,
        false
      );

      if (!didBotWelcomedUser) {
        await this.sendWelcomeMessages(context);
        await this.welcomedUserProperty.set(context, true);
      } else {
        await this.dispatchToIntent(context);
      }
      await next();
    });

    this.onDialog(async (context, next) => {
      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      await this.sendWelcomeMessages(context);
      await next();
    });
  }

  async run(context) {
    await super.run(context);

    // Save state changes
    await this.userState.saveChanges(context);
  }

  async sendWelcomeMessages(turnContext) {
    const { activity } = turnContext;
    const membersAdded = activity.membersAdded;

    for (const idx in membersAdded) {
      if (membersAdded[idx].id !== activity.recipient.id) {
        const welcomeMessage = `Welcome to Weather 360 Bot ${activity.membersAdded[idx].name}.`;
        await turnContext.sendActivity(welcomeMessage);
        await this.welcomedUserProperty.set(turnContext, true);
        await this.sendSuggestedActions(turnContext);
      }
    }
  }

  async sendSuggestedActions(turnContext) {
    const cardAction = [
      `Know Weather`,
      `Know current temperature`,
      `Know Min and Max temperature`,
      `Know sunrise and sunset time`,
    ];
    const reply = MessageFactory.suggestedActions(
      cardAction,
      `What would you like to do today ?`
    );
    await turnContext.sendActivity(reply);
  }

  async dispatchToIntent(turnContext) {
    let currentIntent = "";
    const previousIntent = await this.previousIntent.get(turnContext, {});
    const conversationData = await this.conversationData.get(turnContext, {});

    if (previousIntent.intentName && !conversationData.endDialog) {
      currentIntent = previousIntent.intentName;
    } else if (previousIntent.intentName && conversationData.endDialog) {
      currentIntent = turnContext.activity.text;
    } else {
      currentIntent = turnContext.activity.text;
      await this.previousIntent.set(turnContext, {
        intentName: turnContext.activity.text,
      });
    }

    switch (currentIntent) {
      case "hello":
      case "hi":
      case "hey":
        await turnContext.sendActivity(
          `Hello ${turnContext.activity.from.name}`
        );
        await this.sendSuggestedActions(turnContext);
        break;
      case "Know Weather":
        await this.conversationData.set(turnContext, false);
        await this.weatherDialog.run(turnContext, this.dialogState);
        this.conversationData.endDialog =
          await this.weatherDialog.isDialogEnded();
        if (this.conversationData.endDialog)
          await this.sendSuggestedActions(turnContext);
        break;
      default:
        await turnContext.sendActivity(
          "Did not understand the provided value, apologies."
        );
    }
  }
}

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);
const bot = new DemoBot(conversationState, userState);

export default bot;
