var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var app = express();
var PORT = process.env.PORT || 80; //for Heroku
// var PORT = process.env.PORT || 3000;
//middleware

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

//Mongo time
var MongoClient = mongodb.MongoClient;

//Connection where Mongo is running
var mongoUrl = 'mongodb://localhost:27017/gettingLate_db'; // For local
// var mongoUrl = 'mongodb://heroku_t4dwngxj:ou7c4bufgjd0vte17dk270b5rb@ds031915.mlab.com:31915/heroku_t4dwngxj';

//starting with the backend routes

app.get('/', function(request, response){
  response.json({"Description":"The Getting Late API"});
});

app.post('/possible-routes', function(request, response){
  console.log("request.body", request.body);
  MongoClient.connect(mongoUrl, function (err, db){
    var gettingLateCollection = db.collection('gettingLate');
    if (err) {
      console.log("Can't connect to mongoDB rn. AND THE ERROR IS: ", err);
    } else {
      console.log("We're now connected to ", mongoUrl);
      console.log('Now lets start saving');

      var newRoute = request.body;
      gettingLateCollection.insert([newRoute], function (err, result) {
        if (err) {
          console.log(err);
          response.json("ERROR");
        } else {
          console.log("We're saved!");
          console.log('RESULT is: ', result);
          console.log("This is the end.");
          response.json(result);
        }
        db.close(function(){
          console.log("CLOSED the database");
        });
      })//ending the find bit
    }//ending the else bit
  })//ending the connect with Mongo
})//ending the POST function

app.get('/gettingLate', function(request, response){
  console.log("request: ", request);
  MongoClient.connect(mongoUrl, function(err, db){
    var gettingLateCollection = db.collection('gettingLate');
    if (err) {
      console.log("Can't connect to mongoDB rn. AND THE ERROR IS: ", err);
    } else {
      console.log("We're now connected to ", mongoUrl);
      console.log('Now lets start showing?');
    }
    gettingLateCollection.find().toArray(function (err, result) {
        if (err) {
          console.log("ERROR!", err);
          response.json("error");
        } else if (result.length) {
          console.log('Found:', result);
          response.json(result);
        } else { //
          console.log('Nuthin to see here');
          response.json("nuthin found");
        }
        db.close(function() {
          console.log( "database CLOSED");
        });
      }); // end find
       // end else
  }); // end mongo connect

}); // ending app.get

app.delete('/gettingLate/delete', function(request, response) {
  // response.json({"description":"delete by name"});

  console.log("request.body:", request.body);
  console.log("request.params:", request.params);

  MongoClient.connect(mongoUrl, function (err, db) {
    var gettingLateCollection = db.collection('gettingLate');
    if (err) {
      console.log('Unable to connect to the mongoDB server. ERROR:', err);
    } else {
      // We are connected!
      console.log('Deleting time!');

      /* Delete */
      favoritesCollection.remove(request.params, function(err, numOfRemovedDocs) {
        console.log("numOfRemovedDocs:", numOfRemovedDocs);
        if(err) {
          console.log("error!", err);
        } else { // after deletion, retrieve list of all
          gettingLateCollection.find().toArray(function (err, result) {
            if (err) {
              console.log("ERROR!", err);
              response.json("error");
            } else if (result.length) {
              console.log('Found:', result);
              response.json(result);
            } else { //
              console.log('Nuthin there honey');
              response.json("none found");
            }
            db.close(function() {
              console.log( "database CLOSED");
            });
          }); // end find

        } // end else
      }); // end remove

    } // end else
  }); // end mongo connect

}); // end delete




app.listen(PORT, function(){
  console.log('listen to events on a "port".');
});
