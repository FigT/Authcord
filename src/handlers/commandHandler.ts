import {REST, Routes} from 'discord.js';
import * as process from 'node:process';
import {Command} from '../commands/command';
import {AddAccountCommand} from '../commands/addAccountCommand';
import {RemoveAccountCommand} from '../commands/removeAccountCommand';
import {GetTokenCommand} from '../commands/getTokenCommand';
import {logger} from '../index';


export const commands = new Map<string, Command>()
  .set('add-account', new AddAccountCommand())
  .set('remove-account', new RemoveAccountCommand())
  .set('get-token', new GetTokenCommand());

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

export async function registerCommands(guildId: string) {
  try {
    logger.info('Refreshing application (/) commands...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
      {
        body: Array.from(commands.values()),
      },
    );

    logger.info('Successfully reloaded application (/) commands.');
  } catch (e: any) {
    logger.error(e);
  }
}
