//require the driver mongodb
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//provide the url
const url ='mongodb://localhost:27017';
const dbname = 'conFusion';//db created by mongo REPL
//connecting to mongodb
MongoClient.connect(url,(err,client)=>{
    //check err is null or not if null the proceed else print the error in console
    assert.equal(err,null);
    console.log('Connected correctly to server');
    const db = client.db(dbname);
    const collection =db.collection('dishes');
    //insert operation
    collection.insertOne({"name":"Gourab","age":25},(err,result)=>{
        assert.equal(err,null);
        console.log('after insert');
        console.log(result.ops);
        //once insert is done then we will find i.e under the callback
        collection.find({}).toArray((err,docs)=>{
        assert.equal(err,null);   
        console.log('Found:\n');
        console.log(docs);
        ////drop the collection and close the connection to server
        // dropCollection('dishes',(err,result)=>{
        //     assert.equal(err,null);
        //     client.close();
        // });
        });
    });

})