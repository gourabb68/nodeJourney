const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const commentsSchema = new Schema({
    rating:{
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,  // this field will store ref of id of user model
        ref: 'User'
    }
},{
    timestamps: true
     
});
const dishSchema = new Schema({
    name :{
        type: String,
        required: true,
        unique: true //no 2 document have the same field value name
    },
    description:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
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
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentsSchema]
},{
 timestamps: true

});


var Dishes = mongoose.model('cycle',dishSchema);
module.exports = Dishes;

/* if you are getting path validation error then comment the required true part
*/