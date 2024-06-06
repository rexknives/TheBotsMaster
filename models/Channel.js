module.exports = class Channel {

    constructor(users = [], opts) {

        this.id = null;
        this.name = '';
        this.users = users;
        this.client = opts.client;
        this.rawClient = opts.rawClient;
        this.topic = '';
        this.users = [];

        this.options = opts;
    }
    
    join = () => {}

    leave = () => {}

    getUsers = () => {}

    sendMsg = () => {}
}