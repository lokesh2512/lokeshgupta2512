const core = require('@actions/core');
const github = require('@actions/github');

const {Bot} = require('@wireapp/bot-api');
const {MemoryEngine} = require('@wireapp/store-engine');

const fs = require('fs');
const path = require('path');

const DATA = './data';

require('dotenv').config();

const {WIRE_CONVERSATION, WIRE_EMAIL, WIRE_PASSWORD, WIRE_TEXT} = process.env;

const config = {
  backend: 'production',
  clientType: 'temporary',
  conversations: [],
  owners: [],
};

const loginBot = async (bot, storeEngine) => {
  await bot.start(storeEngine);
  if (bot.account) {
    const userId = bot.account.userId;
    const clientId = bot.account.clientId;
    console.info(
      `Bot is running. Backend '${config.backend}',`,
      `User ID '${userId}',`,
      `Client ID '${clientId}',`,
      `Client Type '${config.clientType}'.`,
    );
  } else {
    throw Error(
      'Bot does not have an account assigned which means it is not initialized properly.',
    );
  }

  return bot;
};

const startBot = async (bot, storeEngine) => {
  try {
    return await loginBot(bot, storeEngine);
  } catch (error) {
    console.error(error.label);
    throw error;
  }
};

(async () => {
  const email = core.getInput('email') || WIRE_EMAIL;
  const password = core.getInput('password') || WIRE_PASSWORD;
  const conversation = core.getInput('conversation') || WIRE_CONVERSATION;
  const text = core.getInput('text') || WIRE_TEXT;
  console.info('Creating bot', email, conversation, text);
  const bot = new Bot({email, password}, config);
  const storeEngine = new MemoryEngine();

  if (!fs.existsSync(DATA)){
    fs.mkdirSync(DATA);
    fs.writeFileSync(path.join(DATA, 'hello.txt'), 'Hello, world!')
    core.info('Creating directory', DATA);
  } else {
    core.info('Directory exists', DATA);
  }
  process.exit(0);
  // try {
  //   await storeEngine.init('wire-github-action-bot');
  // } catch (error) {
  //   console.error('init', error);
  //   core.setFailed(error);
  // }
  // try {
  //   await startBot(bot, storeEngine);
  // } catch (error) {
  //   console.error('startBot', error);
  //   core.setFailed(error);
  // }

  // try {
  //   await bot.sendText(conversation, text);
  //   console.info('Message sent', text);
  //   process.exit(0)
  // } catch (error) {
  //   console.error('sendText', error);
  //   core.setFailed(error);
  // }
})().catch(error => core.setFailed(error));
