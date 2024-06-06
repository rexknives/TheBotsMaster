module.exports = class User {

    constructor(opts) {

        Object.assign(this, opts);
    }

    sendPrivMsg = (msg) => this.client.sendPrivMsg(
        this, typeof msg === 'string' ? {content: msg} : msg
    );

    privChannel = { sendMsg: this.sendPrivMsg }

}

const exampleOpts = {
    id: null,
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    time: null,
    client: null,
    rawClient: null
}