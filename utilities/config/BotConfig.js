const logger = require('../logger');

const DEFAULT_COMMAND_PUNC = '!';

module.exports = () => DEFAULT_COMMAND_PUNC;


class BotConfig {

    constructor(opts) {
        this.options = opts;
    }


}

// custom command punctuation

// activeChatServices


const exampleOpts = {
    botName: '',
    email: '',
    commandPunctuation: '!',
    logger: logger,
    chatServices: [
        //...
    ]
};
