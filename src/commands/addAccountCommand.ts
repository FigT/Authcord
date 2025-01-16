import {Command} from "./command";
import {CommandInteraction, MessageFlagsBitField} from "discord.js";
import {AuthType} from "@prisma/client";
import {prisma} from "../index";

export class AddAccountCommand extends Command {

    constructor() {
        super();

        this.setName('add-account');
        this.setDescription('Adds a new account to the database');
        this.addStringOption(o => {
            o.setName('name');
            o.setDescription('The name of the account');
            o.setRequired(true);
            return o;
        });

        this.addStringOption(o => {
            o.setName('secret');
            o.setDescription('The secret key for the account');
            o.setRequired(true);
            return o;
        });

        this.addStringOption(o => {
            o.setName('type');
            o.setDescription('The type of authentication to use');
            o.setRequired(false);
            o.setChoices([
                {name: 'TOTP', value: 'TOTP'},
                {name: 'HOTP', value: 'HOTP'}
            ]);
            return o;
        });

        this.addIntegerOption(o => {
            o.setName('digits');
            o.setDescription('The number of digits in the authentication code');
            o.setRequired(false);
            return o;
        });

        this.addIntegerOption(o => {
            o.setName('counter');
            o.setDescription('The counter for HOTP, only required for HOTP accounts');
            o.setRequired(false);

            return o;
        });
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        let typeStr = 'TOTP';
        let digits = 6;

        const nameOption = interaction.options.get('name', true);
        const secretOption = interaction.options.get('secret', true);
        const typeOption = interaction.options.get('type', false);
        const digitsOption = interaction.options.get('digits', false);
        const counterOption = interaction.options.get('counter', false);

        if (typeOption) {
            typeStr = typeOption.value as string;
        }

        if (digitsOption) {
            digits = digitsOption.value as number;
        }

        const type: AuthType = typeStr === 'TOTP' ? AuthType.TOTP : AuthType.HOTP;

        if (type === AuthType.HOTP && !counterOption) {
            await interaction.reply(
                {
                    content: 'You must provide a counter for HOTP accounts',
                    flags: MessageFlagsBitField.Flags.Ephemeral
                });

            return;
        }


        await interaction.deferReply({flags: MessageFlagsBitField.Flags.Ephemeral});


        const account = await prisma.account.findUnique({
            where: {
                name: nameOption.value as string
            }
        });


        if (account) {
            await interaction.editReply('An account with that name already exists, please choose a different name.');
            return;
        }


        await prisma.account.create({
            data: {
                name: nameOption.value as string,
                type: type,
                digits: digits,
                secret: secretOption.value as string,
                counter: counterOption?.value as number
            }
        });

        await interaction.editReply('Account added successfully!');
    }
}
