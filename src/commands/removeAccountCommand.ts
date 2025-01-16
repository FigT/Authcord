import {Command} from "./command";
import {AutocompleteInteraction, CommandInteraction, MessageFlagsBitField} from "discord.js";
import {prisma} from "../index";

export class RemoveAccountCommand extends Command {

  constructor() {
    super();

    this.setName('remove-account');
    this.setDescription('Removes an account from the database');

    this.addStringOption(o => {
      o.setName('name');
      o.setDescription('The name of the account to remove');
      o.setRequired(true);
      o.setAutocomplete(true);
      return o;
    });

  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const nameOption = interaction.options.get('name', true);

    await interaction.deferReply({ flags: MessageFlagsBitField.Flags.Ephemeral });


    const account = await prisma.account.findUnique({
      where: {
        name: nameOption.value as string
      },
      select: { name: true }
    });

    if (!account) {
      await interaction.editReply(`Account \`${nameOption.value}\` not found, nothing to remove.`);
      return;
    }

    await prisma.account.delete({
      where: {
        name: nameOption.value as string
      }
    });


    await interaction.editReply(`Account \`${nameOption.value}\` removed successfully!`);
  }

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused();

    const choices = await prisma.account.findMany({
      select: { name: true },
      where: {
        name: {
          startsWith: focused
        }
      }
    });


    await interaction.respond(choices.map(c => ({ name: c.name, value: c.name })));
  }
}
