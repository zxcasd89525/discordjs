import { Client, Events, GatewayIntentBits,Collection } from 'discord.js'
import vueinit from '@/core/vue'
import {loadCommands,loadEvents} from '@/core/loader'
import {useAppStore} from '@/store/app'
import dotenv from "dotenv"

dotenv.config()
vueinit()
loadCommands()

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.cooldowns = new Collection();
const appStore = useAppStore()
appStore.client = client

loadEvents()

client.login(process.env.TOKEN);