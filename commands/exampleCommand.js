import getCmdPunc from "../utilities/config/BotConfig";

module.exports = {
	command: getCmdPunc() + 'testcmd',
	async execute(interaction) {

		//interaction.locale

		if (!interaction.isChatInputCommand()) return;

		//const message = await interaction.fetchReply();
		//interaction.options.getUser('target');
		//interaction.options.getString('reason') ?? 'No reason provided';
		//interaction.options.getSubcommand() === 'user'

		try {

		} catch (error) {

			console.error(error);

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}

			//await interaction.editReply('Pong again!');
			//await interaction.deferReply({ ephemeral: true });
			//await interaction.deleteReply();
		}
	}
};