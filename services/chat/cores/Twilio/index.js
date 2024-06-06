module.exports = {
    core: require('./TwilioCore'),
    channels: [require('./TwilioVoiceChannel')],
    extensions: {
        plugins:    [],
        middleware: [],
        commands:   []
    }
}