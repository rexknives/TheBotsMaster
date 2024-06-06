module.exports = class User {

    constructor(opts) {

        Object.assign(this, opts);
    }

    sendPriveMsg = () => {
        
    }
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