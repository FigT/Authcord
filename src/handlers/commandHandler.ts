import { REST, Routes, SlashCommandBuilder, CommandInteraction } from 'discord.js';
import * as process from 'node:process';
import { DebugCommand } from '../commands/debugCommand';
import {Command} from "../commands/command";



export const commands = new Map<string, Command>()
  .set('debug', new DebugCommand());

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

export async function registerCommands(guildId: string) {
  try {
    console.log('Refreshing application (/) commands...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
      {
        body: Array.from(commands.values()),
      },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (e) {
    console.error(e);
  }
}
