const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../model/favorite');
const favoriteRouter = express.Router();
var authenticate = require('../authenticate');
const Dishes = require('../model/dishes');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        //check only the user's favorite dishes
        Favorites.findOne({ "user": req.user })
            .populate('dishes')
            .populate('user')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));

    })
    .post(authenticate.verifyUser, (req, res, next) => {
        //check user in favorite collection
        Favorites.findOne({ "user": req.user })
            .then((fav) => {
                //if user is present in favorite then update the dishes
                if (fav) {
                    //loop over dishes                    
                    for (var i of req.body) {
                        //check if dish is not added as favorite then only add it
                        if (fav.dishes.indexOf(i._id) === -1) {
                            fav.dishes.push(i._id);
                        }
                    }
                    //save the dishes into collection when loop is over     
                    fav.save()
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);
                        })
                }
                else {
                    //not present create user first
                    Favorites.create(
                        { "user": req.user._id }
                    )
                        .then((users) => {
                            //created successfully
                            if (users) {
                                //add all the dishes one by one
                                for (var i of req.body) {
                                    users.dishes.push(i);
                                }
                                //save the dishes
                                users.save()
                                    .then((resp) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(resp);
                                    }, (err) => next(err));
                            }
                        }, (err) => next(err));
                }
            })
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Favorite dishes');
    })

    //delete all the dishes from favorite
    .delete(authenticate.verifyUser, (req, res, next) => {
        //check the user
        Favorites.findOne({ "user": req.user })
            .then((fav) => {
                // if user is present
                if (fav) {
                    fav.remove({})
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    //not found 
                    err = new Error('no disk is found as favorite');
                    err.status = 404;
                    return next(err);
                }

            })
    })


//for specific dish
favoriteRouter.route('/:dishId')
    .get(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /Favorite dishes/' + req.params.dishId);
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        //check for the specific user
        Favorites.findOne({ "user": req.user })
            .then((fav) => {
                //if user is present in favorite then update the dishes
                if (fav) {
                    //check dish already present ot not if not present then add it                                                     
                    if (fav.dishes.indexOf(req.params.dishId) === -1) {
                        fav.dishes.push(req.params.dishId);
                        fav.save()
                            .then((resp) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(resp);
                            });
                    }
                    else {
                        err = new Error('Dishes ' + req.params.dishId + ' already added as Favorite');
                        err.status = 404;
                        return next(err);
                    }
                }
                else {
                    //not present create user first
                    Favorites.create(
                        { "user": req.user._id }
                    )
                        .then((users) => {
                            //created successfully
                            if (users) {
                                //add  the dish
                                users.dishes.push(req.params.dishId);
                                //save the dishes
                                users.save()
                                    .then((resp) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(resp);
                                    }, (err) => next(err));
                            }
                        }, (err) => next(err));
                }

            })
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Favorite dishes/' + req.params.dishId);
    })

    //delete specific dishes from favorite
    .delete(authenticate.verifyUser, (req, res, next) => {
        //check the user 
        Favorites.findOne({ "user": req.user })
            .then((fav) => {
                // if user is present
                if (fav) {
                    //check the dish id present or not                                        
                        if (fav.dishes.indexOf(req.params.dishId) !== -1) {
                                //found delete it                                
                                fav.dishes.splice(fav.dishes.indexOf(req.params.dishId), 1);                                
                                //save it
                                fav.save()
                                    .then((resp) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(resp);
                                    });
                            } 
                            else {
                                //not found 
                                err = new Error('Dish ' + req.params.dishId + ' not found');
                                err.status = 404;
                                return next(err);
                            }                        
                }
                // if user is not there 
                else {
                    err = new Error('No Dishes added as Favorite');
                    err.status = 404;
                    return next(err);
                }
            })
    })


module.exports = favoriteRouter;