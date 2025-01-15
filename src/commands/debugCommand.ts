import {Command} from './command';
import {CommandInteraction, MessageFlagsBitField} from 'discord.js';

export class DebugCommand extends Command {
  constructor() {
    super();

    this.setName('debug');
    this.setDescription('Debug command');
    this.setDefaultMemberPermissions(0);
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      content: `<@${interaction.user.id}> used the debug command!`,
      flags: MessageFlagsBitField.Flags.Ephemeral });
  }
}
