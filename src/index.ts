import dotenv from 'dotenv';
import * as process from 'node:process';
import { Client, Events } from 'discord.js';
import { PrismaClient } from '@prisma/client'
import * as commandHandler from './handlers/commandHandler';
import {fieldEncryptionExtension} from "prisma-field-encryption";

dotenv.config();

export const client = new Client({
  intents: ['Guilds', 'GuildMessages'],
});

export const prisma = new PrismaClient().$extends(
  fieldEncryptionExtension({
    encryptionKey: process.env.ENCRYPTION_KEY
  })
)



async function main() {
  if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID || !process.env.DATABASE_URL) {
    throw new Error('Missing environment variables');
  }

  client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user?.tag}, need to invite the bot? https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=68608&integration_type=0&scope=applications.commands+bot`);

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

main().then(r => {
  console.log('Bot started');
});
