import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import Telegram from './database/schema.js'
import Statistic from "./database/statistic.js";
import options from './options.js'
dotenv.config()

mongoose.set('strictQuery', true)

const { MONGO_URL, TOKEN } = process.env
const {orderClientOption, orderOptions, startOptions, statisticHistoryOption, statisticOption} = options

async function start(){
    try{

        await mongoose.connect(MONGO_URL)

        const bot = new TelegramBot(TOKEN, {polling: true})

        bot.setMyCommands([
            {command: '/start', description: 'Почати роботу'},
            {command: '/orders', description: 'Переглянути замовлення'},
            {command: '/statistic', description: 'Показати статистику'},
        ])        

        bot.on('message', async msg => {
            const {chat, text} = msg    

            try{

                if(text === '/start'){
                    return await bot.sendMessage(chat.id, `Виберіть категорію`, startOptions)
                }

                if(text === '/orders'){
                    const orders = await Telegram.find()
                    const parseOrders = orders.map(order => ({id: order._id, content: order.content, constact: order.contact, chat: JSON.parse(order.chat)}))

                    return await bot.sendMessage(chat.id, `Виберіть покупця для перегляду деталей`, orderOptions(parseOrders))
                }

                if(text === '/statistic'){
                    const stat = await Statistic.find()
                    return await bot.sendMessage(chat.id, `Виберіть користувача для перегляду деталей`, statisticOption(stat))
                }

            }catch (e){
                console.log(e);
                await bot.sendMessage(chat.id, `Something went wrong`)
            }
        })

        bot.on('callback_query', async msg => {
            const data = msg.data
            const id = msg.message.chat.id

            if(data.length === 24){
                const candidate = await Statistic.findById(data)
                const order = await Telegram.findById(data)

                if(candidate){
                    const userInfo = Object.keys(candidate.user).map(key => `${key}: ${candidate.user[key]}`).join('\n')
                    return await bot.sendMessage(id, `${userInfo}\nІсторія: ${candidate.transition.map(h => h.includes('/') ? h.substring(1) : h).join(' -> ')}`, statisticHistoryOption(candidate._id))
                }
                if(order){
                    const chat = JSON.parse(order.chat)
                    const orderInfo = Object.keys(chat).map(key => `${key}: ${chat[key]}`).join('\n')

                    return await bot.sendMessage(id, `${orderInfo}\nЗамовлення: ${order.content}\nКонтакт: ${order.contact}`, orderClientOption(order._id))
                }
            }

            if(data === '/orders'){
                const orders = await Telegram.find()
                const parseOrders = orders.map(order => ({id: order._id, content: order.content, constact: order.contact, chat: JSON.parse(order.chat)}))

                return await bot.sendMessage(id, `Виберіть покупця для перегляду деталей`, orderOptions(parseOrders))
            }

            if(data === "/statistic"){
                const stat = await Statistic.find()
                return await bot.sendMessage(id, `Виберіть користувача для перегляду деталей`, statisticOption(stat))
            }
 
            if(data.includes("/delete")){
                const statistic = await Statistic.findByIdAndDelete(data.split('?')[1])

                if(!statistic){
                    const order = await Telegram.findByIdAndDelete(data.split('?')[1])
                }
                
                return await bot.sendMessage(id, `Користувача видалено`)
            }
        })
    }catch (e){
        console.log(e);
    }
}

start()
