const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
    name :{
        type: String,
        required: true,
        unique: true 
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        require: true,
        min: 0
    },
    description:{
        type: String,
        required: true
    }
},{
 timestamps: true

});


var Promotions = mongoose.model('promotion',promotionSchema);
module.exports = Promotions;

