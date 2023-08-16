# Weather Bot

Weathe Bot is a JavaScript Bot created using [Bot Framework](https://dev.botframework.com), it shows the weather in your area using [Open weather Api](https://openweathermap.org).
It is my first bot which I implemented by changing code from the echo bot template.

## Prerequisites

- [Node.js](https://nodejs.org) version 14.14.1 or higher

  ```bash
  # determine node version
  node --version
  ```

## To run the bot

- Install modules

  ```bash
  npm install
  ```

- Provide open weather api key in .env file

  ```bash
  WEATHER_API = your_api_key
  ```

- Start the bot

  ```bash
  npm start
  ```

## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows you to test and debug your bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.9.0 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`

## Contributing

Pull requests are welcome. Suggestions on how to improve the code and optimization are welcome, please open an issue first
to discuss what you would like to suggest or change.

## Socials

[LinkedIn-ofcljaved](https://linkedin.com/in/ofcljaved) \
[twitter-ofcljaved](https://twitter.com/ofcljaved)
