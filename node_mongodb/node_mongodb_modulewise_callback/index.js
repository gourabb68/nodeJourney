//require the driver mongodb
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//require the generic CRUD module
const dboper = require('./operation.js');
//provide the url
const url = 'mongodb://localhost:27017';
const dbname = 'conFusion';//db created by mongo REPL
//connecting to mongodb
MongoClient.connect(url, (err, client) => {
    //check err is null or not if null the proceed else print the error in console
    assert.equal(err, null);
    console.log('Connected correctly to server');
    const db = client.db(dbname);
    dboper.insertDocument(db, { name: "Vadonut", description: "Test"},
    "dishes", (result) => {
        console.log("Insert Document:\n", result.ops);

        dboper.findDocuments(db, "dishes", (docs) => {
            console.log("Found Documents:\n", docs);

            dboper.updateDocument(db, { name: "Vadonut" },
                { description: "Updated Test" }, "dishes",
                (result) => {
                    console.log("Updated Document:\n", result.result);

                    dboper.findDocuments(db, "dishes", (docs) => {
                        console.log("Found Updated Documents:\n", docs);
                        
                        db.dropCollection("dishes", (result) => {
                            console.log("Dropped Collection: ", result);

                            client.close();
                        });
                    });
                });
        });
});
    });
// });