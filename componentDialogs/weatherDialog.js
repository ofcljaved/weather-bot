import {
  ChoicePrompt,
  ComponentDialog,
  ConfirmPrompt,
  DialogSet,
  DialogTurnStatus,
  NumberPrompt,
  TextPrompt,
  WaterfallDialog,
} from "botbuilder-dialogs";

const CHOICE_PROMPT = "CHOICE_PROMPT";
const CONFIRM_PROMPT = "CONFIRM_PROMPT";
const TEXT_PROMPT = "TEXT_PROMPT";
const NUMBER_PROMPT = "NUMBER_PROMPT";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";
let endDialog = false;

class WeatherDialog extends ComponentDialog {
  constructor(conversationState, userState) {
    super("WEATHER_DIALOG");
    this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
    this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
    this.addDialog(new TextPrompt(TEXT_PROMPT));
    this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.postalCodeValidator));
    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.firstStep.bind(this), //Ask confirmation if user want to know weather,
        this.getName.bind(this), //Get Name from user
        this.getPostalCode.bind(this), //Get Postal Code from user
        this.getCountryCode.bind(this), //Get Country Code from use
        this.confirmStep.bind(this), // Confirm data entered by user
        this.summaryStep.bind(this), // Sums it up
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async run(turnContext, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);
    const dialogContext = await dialogSet.createContext(turnContext);

    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  async firstStep(stepContext) {
    endDialog = false;
    return await stepContext.prompt(
      CONFIRM_PROMPT,
      "Would you like to know weather?",
      ["yes", "no"]
    );
  }

  async getName(stepContext) {
    if (stepContext.result)
      return await stepContext.prompt(TEXT_PROMPT, "What is your name?");
  }

  async getPostalCode(stepContext) {
    stepContext.values.name = stepContext.result;
    return await stepContext.prompt(NUMBER_PROMPT, "What is your postal code?");
  }

  async getCountryCode(stepContext) {
    stepContext.values.postalCode = stepContext.result;
    return await stepContext.prompt(
      TEXT_PROMPT,
      "What is your country code? eg.'IN' for India"
    );
  }

  async confirmStep(stepContext) {
    stepContext.values.countryCode = stepContext.result;
    const {
      values: { name, postalCode, countryCode },
    } = stepContext;
    const msg = `Please review your entered values:
    Name: ${name}
    Postal Code: ${postalCode}
    Country Code: ${countryCode}`;

    await stepContext.context.sendActivity(msg);
    return await stepContext.prompt(
      CONFIRM_PROMPT,
      "Are you sure that all values are correct?",
      ["yes", "no"]
    );
  }

  async summaryStep(stepContext) {
    if (stepContext.result) {
      const {
        values: { postalCode, countryCode },
      } = stepContext;
      const api = `https://api.openweathermap.org/data/2.5/weather?zip=${postalCode},${countryCode}&appid=${process.env.WEATHER_API}`;

      const fetchResponse = await fetch(api);
      const weather = await fetchResponse.json();

      await stepContext.context.sendActivity(
        `It's ${weather.weather[0].main} in your area with wind speed of ${weather.wind.speed}m/s.`
      );
      endDialog = true;
      return stepContext.endDialog();
    }
  }

  async postalCodeValidator(promptContext) {
    const {
      recognized: { value },
    } = promptContext;
    return (
      promptContext.recognized.succeeded &&
      value.toString().length > 4 &&
      value.toString().length < 7
    );
  }

  async isDialogEnded() {
    return endDialog;
  }
}

export default WeatherDialog;
