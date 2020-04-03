const mongoose = require('mongoose');

const Dishes = require('./model/dishes');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);


connect.then((db) => {

    console.log('Connected correctly to server');
    Dishes.create({
        name: 'sourav',
        description: 'test'
    })
        .then((dish) => {
            console.log(dish);
            return Dishes.findByIdAndUpdate(dish._id, {
                //dish._id taking current dish id
                $set: { description: 'updated test' }
            }, {
                new: true
            }).exec();
        })
        .then((dish) => {

            console.log(dish);
            dish.comments.push({
                rating: 5,
                comment: "great",
                author: "Rabindra"
            });
            return dish.save();
        })
        .then((dish) => {
            console.log(dish);
        //     return Dishes.remove({}); //delete all dishes documnt
        })
        // .then(() => {
        //     //     return mongoose.connection.close();//close the conection
        // })
        .catch((err) => {
            console.log(err);
        });

});
