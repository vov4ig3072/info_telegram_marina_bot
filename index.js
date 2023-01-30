import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import Telegram from './schema.js'
dotenv.config()

mongoose.set('strictQuery', true)

const { MONGO_URL, TOKEN } = process.env

async function start(){
    try{

        await mongoose.connect(MONGO_URL)

        const bot = new TelegramBot(TOKEN, {polling: true})

        bot.setMyCommands([
            {command: '/start', description: 'Start work'},
        ])        

        bot.on('message', async msg => {
            const {chat, text} = msg    
            const id = text.split(' ')[text.split(' ').length - 1]

            console.log(id);
            try{
                const telegram = await Telegram.findOne({id})
                const {username, first_name} = JSON.parse(telegram.chat)

                await bot.sendMessage(chat.id, `Замовник: ${first_name || username}\nЗамовлення: ${telegram.content}\nКонтакт: ${telegram.contact}`)
            }catch (e){
                console.log(e);
                await bot.sendMessage(chat.id, `Something went wrong`)
            }
        })
    }catch (e){
        console.log(e);
    }
}

start()
