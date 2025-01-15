import {AutocompleteInteraction, CommandInteraction, SlashCommandBuilder} from "discord.js";

export abstract class Command extends SlashCommandBuilder {
  abstract execute(interaction: CommandInteraction): Promise<void>;

  autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    return Promise.resolve();
  }
}
