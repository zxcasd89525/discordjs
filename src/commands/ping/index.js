import { SlashCommandBuilder } from 'discord.js'

export const command = new SlashCommandBuilder()
					.setName('ping')
					.setDescription('Replies with Pong!')
export const action = async (ctx) =>{
	ctx.reply('pong!')
}
