import {model, Schema} from 'mongoose'

const schema = new Schema({
    chat: {type: String, require: true},
    content: {type: String, require: true},
    contact: {type: String, require: true}
})

export default model("Telegram",schema)