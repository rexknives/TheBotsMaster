module.exports = class User {

    constructor(opts) {

        Object.assign(this, opts);
    }

    sendPrivMsg = (msg) => this.client.sendPrivMsg( this, msg );

    getInfo = () => {}

    kick = (time) => this.client.kick( this, time );

    privChannel = { sendMsg: this.sendPrivMsg }
}

const exampleOpts = {
    id: null,
    name: '',
    username: '',
    email: '',
    ipAddress: '',
    phoneNumber: '',
    time: null,
    client: null,
    rawClient: null
}