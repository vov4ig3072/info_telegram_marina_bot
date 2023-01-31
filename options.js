import _ from 'lodash'

export default {
    startOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard:[
                [{text: `Замовлення`, callback_data: `/orders`},{text: `Статистика`, callback_data: `/statistic`}]
            ] ,
          }),
    },
    orderOptions(data){
        return {
            reply_markup: JSON.stringify({
              inline_keyboard: _.chunk(data.map(btn => ({ text: btn.chat.first_name || btn.chat.username || btn.id, callback_data: btn.id })),2) ,
            }),
          }
    },
    statisticOption(data){
        return {
            reply_markup: JSON.stringify({
              inline_keyboard: _.chunk(data.map(btn => ({ text: btn.user.first_name || btn.user.username || btn._id, callback_data: btn._id })),2) ,
            }),
          }
    },
    statisticHistoryOption: (query) => ({
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{text: `Повернутись до списку`, callback_data: `/statistic`},{text: `Видалити запис`, callback_data: `/delete?${query}`}]
          ],
        }),
    }),
    orderClientOption(query){
        return {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: `Повернутись до списку`, callback_data: `/orders`},{text: `Видалити запис`, callback_data: `/delete?${query}`}]
              ],
            }),
        }
    }
}