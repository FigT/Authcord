import {Command} from './command';
import {AutocompleteInteraction, CommandInteraction, MessageFlagsBitField} from 'discord.js';
import {prisma} from '../index';
import {getToken} from '../handlers/otpHandler';

export class GetTokenCommand extends Command {

  constructor() {
    super();

    this.setName('get-token');
    this.setDescription('Gets a 2FA token for the given account');

    this.addStringOption(o => {
      o.setName('account');
      o.setDescription('The account to get the token for');
      o.setRequired(true);
      o.setAutocomplete(true);

      return o;
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const accountOption = interaction.options.get('account', true);

    await interaction.deferReply({flags: MessageFlagsBitField.Flags.Ephemeral});

    const account = await prisma.account.findUnique({
      where: {
        name: accountOption.value as string
      }
    });

    if (!account) {
      await interaction.editReply(`Account \`${accountOption.value}\` not found, please try again.`);
      return;
    }

    const token = getToken(account.name, account.type, account.secret, account.digits, account.counter);

    if (!token) {
      await interaction.editReply(`Failed to generate token for account \`${account.name}\`, please try again.`);
      return;
    }

    if (token.remaining) {
      let timestamp = `<t:${Math.floor(Date.now() / 1000) + token.remaining}:R>`;

      await interaction.editReply(`Current token for account \`${account.name}\` is \`${token.token}\` (expires ${timestamp})`);
      return;
    }

    await interaction.editReply(`Token for account \`${account.name}\` is \`${token}\``);
  }

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused();

    const choices = await prisma.account.findMany({
      select: {name: true},
      where: {
        name: {
          startsWith: focused
        }
      }
    });

    interaction.respond(choices.map(c => ({name: c.name, value: c.name})));
  }
}
