module.exports = class Channel {

    constructor(users = [], opts) {

        this.id = null;
        this.name = opts.name;
        this.users = users;
        this.client = opts.client;
        this.rawClient = opts.client.client;
        this.topic = '';
        this.users = [];

        this.options = opts;
    }
    
    join = () => {}

    leave = () => {}

    getUsers = () => {}

    sendMsg = (msg) => {
        return this.client.sendMsg(this, msg);
    }
}