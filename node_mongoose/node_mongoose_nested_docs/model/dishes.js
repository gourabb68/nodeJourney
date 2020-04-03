const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
        type: String,
        required: true
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
    comments: [commentsSchema]
},{
 timestamps: true

});

var Dishes = mongoose.model('dish',dishSchema);
module.exports = Dishes;

/* if you are getting path validation error then comment the required true part
*/