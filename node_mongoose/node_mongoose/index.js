const mongoose = require('mongoose');

const Dishes =require('./model/dishes');
const url = 'mongodb://localhost:27017/nodeDB';
const connect = mongoose.connect(url);


connect.then((db) => {

    console.log('Connected correctly to server');

    var newDish = Dishes({
        name: 'nn',
        description: 'test'
    });

    newDish.save()
        .then((dish) => {
            console.log(dish);

            return Dishes.find({});
        })
        .then((dishes) => {
            console.log(dishes);

        //     return Dishes.remove({}); //delete all dishes documnt
        // })
        // .then(() => {
        //     return mongoose.connection.close();//close the conection
        })
        .catch((err) => {
            console.log(err);
        });

});
