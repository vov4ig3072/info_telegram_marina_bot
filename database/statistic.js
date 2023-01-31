import {model, Schema} from 'mongoose'

const schema = new Schema({
    user: {type: Object, require: true},
    transition: {type: Array, items: String, require: true}
})

export default model("Statistic",schema)