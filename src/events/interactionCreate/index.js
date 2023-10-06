import { Events,Collection } from 'discord.js'
import {useAppStore} from '@/store/app'

export const event = {
    name : Events.InteractionCreate
}

export const action = async (interaction) => {
    if(!interaction.isChatInputCommand())return

    const appStore = useAppStore()
    const cooldowns = appStore.client.cooldowns;

    if(!cooldowns.has(interaction.commandName)){
        cooldowns.set(interaction.commandName, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(interaction.commandName);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (appStore.cooldownsMap.get(interaction.commandName) ?? defaultCooldownDuration) * 1000;
    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            return interaction.reply({ content: `Please wait, you are on a cooldown for "reload". You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
        }
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    const action = appStore.commandsActionMap.get(interaction.commandName)
    await action(interaction)
}