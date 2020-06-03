 let Mongoclient = require('mongodb').MongoClient
 let MongoDB_URI="mongodb://localhost:3000/mydb"
 MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });