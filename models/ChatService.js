module.exports = class ChatService {
    constructor(opts) {
        const exampleOpts = {
            user: "someUser",
            pass: "somePass",
            token: "xxxxxxxxxx",
            services: {
                "discord": {
                    intents: [

                    ]
                },
                "irc": {
                    //...
                }
            }
        };
    }

    login = () => {

    }

    logout = () => {

    }

    join = () => {

    }

    leave = () => {

    }

    listChannels = () => {

    }
    
    privateMsg = () => {

    }

    selfMetaData = () => {

    }

    //TODO: caches
    //TODO:   users
    //TODO:   channels

}