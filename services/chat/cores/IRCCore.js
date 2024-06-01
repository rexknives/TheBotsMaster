import irc from 'matrix-org-irc';

module.exports = class IRCCore extends ChatService {

    constructor(opts) {

        this.options = opts;
        this.client = new irc.Client(opts);
    }

    setupListeners = () => {

        this.client.addListener('error', (message) => {
            console.error('ERROR: %s: %s', message.command, message.args.join(' '));
        });

        this.client.addListener('message#blah', (from, message) => {
            console.log('<%s> %s', from, message);
        });
        
        this.client.addListener('message', (from, to, message) => {
            console.log('%s => %s: %s', from, to, message);
        
            if (to.match(/^[#&]/)) {
                // channel message
                if (message.match(/hello/i)) {
                    this.client.say(to, 'Hello there ' + from);
                }
                if (message.match(/dance/)) {
                    setTimeout(() => { this.client.say(to, '\u0001ACTION dances: :D\\-<\u0001'); }, 1000);
                    setTimeout(() => { this.client.say(to, '\u0001ACTION dances: :D|-<\u0001');  }, 2000);
                    setTimeout(() => { this.client.say(to, '\u0001ACTION dances: :D/-<\u0001');  }, 3000);
                    setTimeout(() => { this.client.say(to, '\u0001ACTION dances: :D|-<\u0001');  }, 4000);
                }
            }
            else {
                // private message
                console.log('private message');
            }
        });
        this.client.addListener('pm', (nick, message) => {
            console.log('Got private message from %s: %s', nick, message);
        });
        this.client.addListener('join', (channel, who) => {
            console.log('%s has joined %s', who, channel);
        });
        this.client.addListener('part', (channel, who, reason) => {
            console.log('%s has left %s: %s', who, channel, reason);
        });
        this.client.addListener('kick', (channel, who, by, reason) => {
            console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
        });
    }
}