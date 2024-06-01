const ChatService = require('./ChatService');

module.exports = class ChatBot {

    constructor(aConfig) {
        this.botConfig = aConfig;
    }

    parseChatServicesMap = (theChatServices) => {
        const byServiceName = {};

        theChatServices.forEach( service => {

            if( !byServiceName[service.serviceName] ) {

                byServiceName[service.serviceName] = service;

            } else if ( !byServiceName[service.serviceName].serviceName ) {

                byServiceName[service.serviceName][service.botUserName] = service;
            
            } else {

                const existingService = byServiceName[service.serviceName];
                byServiceName[service.serviceName] = {
                    [service.botUserName]: service,
                    [existingService.botUserName]: existingService
                };
            }
        });

        return byServiceName;
    }

    getChatServicesMaps = () => {
        return {
            discord: {
                botUserName1: 'DiscordCoreInstance1',
                botUserName2: 'DiscordCoreInstance2',
                botUserName3: 'DiscordCoreInstance3...'
            },
            irc: {
                //...
            }
        }
    };

    getChatServiceInstance = ( chatService, subBotName ) => {
    
        const serviceInstances = this.getChatServicesMaps()[chatService];
        const serviceInstanceArr = Object.values(serviceInstances);

        if ( serviceInstanceArr.length === 1 ) {
            return serviceInstanceArr[0];
        } else if ( serviceInstances[subBotName] ) {
            return serviceInstances[subBotName];
        }

        throw new Error('Ambiguity in retrieving Chat Service instance.');    
    }

    talk = ( msg, chatServiceName, ...args /* subBotName, channels */ ) => {

        let channels = args[args.length - 1];
        let subBotName = args[args.length - 2];

        if ( channels && typeof channels !== 'array' )
            channels = [channels];

        const chatServices = this.getChatServiceInstance()[chatServiceName];

        if ( subBotName && chatService[subBotName] )
            chatServices = [chatServices[subBotName]];
        else if ( !subBotName )
            chatServices = chatServices instanceof ChatService ? [chatServices] : Object.values(chatServices);

        for (serviceInstance in chatServices)
            for (let channel in serviceInstance.channels || chatService.channels)
                channel.send(msg);
    }

    shutdownGracefully = () => {
        //TODO: save/export state
        process.exit();
    }
}