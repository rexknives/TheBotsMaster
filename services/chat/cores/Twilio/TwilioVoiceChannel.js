const { v4: uuidv4 } = require('uuid');
const Twilio = require('twilio');
const Channel = require('../../../../models/Channel');

module.exports = class TwilioVoiceChannel extends Channel {

    constructor(users = [], opts) {

        this.id = null;
        this.name = '';
        this.users = users;
        this.client = opts.client;
        this.options = opts;
    }
    
    join = () => {

        const partyLineGuid = uuidv4();

        this.client.conferences.create({
            friendlyName: this.name,
            id: partyLineGuid,
            statusCallback: () => {},
            statusCallbackEvent: "initiated ringing answered completed",
            statusCallbackMethod: "POST",
        })
        .then((conf) => {
            this.users.forEach((user) => {
                conf.participants.create({
                    from: fromNum,
                    to: `+${user.phoneNumber}`
                });
                logger.log(`Added participant: ${phoneNumber} to conference ${partyLineGuid}`);
            });
        })
        .error(logger.error);
    }

    leave = () => {}

    addUser = () => {}

    getUsers = () => {}
}