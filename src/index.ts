import dotenv from 'dotenv';
import * as process from 'node:process';
import {Client, Events} from 'discord.js';
import {PrismaClient} from '@prisma/client'
import * as commandHandler from './handlers/commandHandler';
import {fieldEncryptionExtension} from 'prisma-field-encryption';
import Logger from '@ptkdev/logger';

dotenv.config();

export const logger = new Logger({
  language: 'en',
  colors: true,
});


if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID || !process.env.DATABASE_URL || !process.env.ENCRYPTION_KEY) {
  logger.error('Missing environment variables, please check your .env file');
  process.exit(1);
}

export const client = new Client({
  intents: ['Guilds', 'GuildMessages'],
});


export const prisma = new PrismaClient().$extends(
  fieldEncryptionExtension({
    encryptionKey: process.env.ENCRYPTION_KEY
  })
);


async function main() {
  logger.info('Connecting to database...');

  await prisma.$connect()
    .then(() => logger.info('Connected to database'))
    .catch(e => {
      logger.error(e);
      process.exit(1);
    });

  client.once(Events.ClientReady, readyClient => {
    logger.info(`Logged in as ${readyClient.user?.tag}, need to invite the bot? https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=68608&integration_type=0&scope=applications.commands+bot`);

    logger.info(`Registering commands for ${readyClient.guilds.cache.size} guilds...`);
    Array.from(readyClient.guilds.cache.values()).forEach(async guild => {
      await commandHandler.registerCommands(guild.id);
    })
  });

  client.on(Events.GuildCreate, async guild => {
    await commandHandler.registerCommands(guild.id);
  });

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

    const command = commandHandler.commands.get(interaction.commandName);

    if (!command) return;

    if (interaction.isAutocomplete()) {
      await command.autocomplete(interaction);
    }

    if (interaction.isCommand()) {
      await command.execute(interaction);
    }
  });

  await client.login(process.env.DISCORD_TOKEN);
}

main()
  .then(() => logger.info('Bot started'));
