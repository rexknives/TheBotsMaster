# "The" Bots Master
Chat bot framework supporting numerous chat services and composition flexibility

# Scenarios:

- one bot, one service, one channel
- one bot, two services, multiple channels on each
- one bot, one service, serveral different usernames/accounts, several channels per each
- several "bots" (conceptually speaking), premade, tied together into one with very little code

Example Bots
- [ ] VoiceMail Bot (encrypted chat text, chat voice, phone voice, and phone SMS storage)
- [ ] Operator Bot (telephony a la The Americans)
- [ ] 

# Todo:
- [ ] Events
    - [ ] automatically set up msg and privMsg event listeners to dispatch "synthetic" Events
    - [ ] give "synthetic" Events reply methods
    - [ ] wire msgs into Middleware stack after event listeners
- [ ] API for voice chat
- [ ] Assistant Server/API - turns bot into API
- [ ] Polyfills
    - [ ] Reply & Threading subsytems & polyfills
    - [ ] media attachment subsystem & polyfill
    - [ ] Voice & video chat polyfill
    - [ ] Normalize Role mgmt subsystem
    - [ ] Normalize Sharding subsystem & API
- [ ] caches
    - [ ] users
    - [ ] channels
- [ ] Chat Services
    - [ ] Signal
    - [ ] Telegram
    - [ ] WhatsApp
    - [ ] Mastodon
    - [ ] XMPP
    - [ ] Slack
    - [ ] Facebook Messenger
    - [ ] Youtube live
    - [ ] Google hangouts
    - [ ] maybe
        - [ ] SMS
        - [ ] WeChat
        - [ ] HipChat
        - [ ] Snapchat
- [ ] future roadmap
    - [ ] Bot Sharding