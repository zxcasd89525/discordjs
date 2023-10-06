import { SlashCommandBuilder } from 'discord.js'
import {loadCommands,loadEvents} from '@/core/loader'

export const cooldown = 30

export const command = new SlashCommandBuilder()
					.setName('reload')
					.setDescription('Reload Commands.')
export const action = async (ctx) =>{
    // console.log(ctx.user.id)
    // console.log(process.env.MY_ID)
    if(ctx.user.id == process.env.MY_ID){
        await loadCommands()
        await loadEvents()
        ctx.reply('reload success.')
    }
	else{
        ctx.reply("You can't use this command.")
    }
}
