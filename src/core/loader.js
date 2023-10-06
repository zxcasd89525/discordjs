import { REST,Routes,Collection } from 'discord.js'
import fg from 'fast-glob'
import {useAppStore} from '@/store/app'

const updateSlashCommands = async (commands) => {
    const rest = new REST({version:10}).setToken(process.env.TOKEN)
    const result = await rest.put(
        Routes.applicationCommands(process.env.APPLICATION_ID),
        {
            body:commands
        }
    )
    // console.log(result)
}

export const loadCommands = async () =>{
    const appStore = useAppStore()
    console.log("load commands:")
    const commands = []
    const actions = new Collection()
    const cooldownsMap = new Collection()
    const command_files = await fg("./src/commands/**/index.js")
    for(const command_file of command_files){
        const commandjs = await import(command_file)
        commands.push(commandjs.command)
        actions.set(commandjs.command.name,commandjs.action)
        cooldownsMap.set(commandjs.command.name,commandjs.cooldown)
        console.log(commandjs.command.name,":",commandjs.command.description)   
    }
    await updateSlashCommands(commands)
    appStore.commandsActionMap = actions
    appStore.cooldownsMap = cooldownsMap
    // console.log(appStore.commandsActionMap)
    console.log('load Commands.')
}

export const loadEvents = async () => {
    const appStore = useAppStore()
    const client = appStore.client
    client.removeAllListeners()
    const event_files = await fg("./src/events/**/index.js")
    for(const event_file of event_files){
        const eventjs = await import(event_file)
        if(eventjs.event.once){
            client.once(
                eventjs.event.name, 
                eventjs.action
            );
        }
        else{
            client.on(
                eventjs.event.name, 
                eventjs.action
            );
        }
    }
    console.log("load Events.")
}