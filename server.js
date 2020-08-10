// ./src/server.js

// importing the dependencies
const express = require('express');
var app = express();
var mongojs = require('mongojs');
// const { request } = require('express');
var db = mongojs('dgappdb', ['characters']);
var bodyParser = require('body-parser');
var path = require('path');

var sortByProperty = function (property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? -1 : 1));
    };
};

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/test', function(req, res){
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/look', function(req, res) { 
    res.send("Hello World!"); 
});

app.get('/characters', function(req, res) {
    // console.log('I got a get request');

    db.characters.find(function (err, docs) {
        // console.log("From get " + docs);
        res.json(docs.sort(sortByProperty('name')));
    }, [{timestamp: mongojs.ObjectId().getTimestamp()}]);
});

app.post('/characters', function(req, res) {
    console.log(JSON.stringify(req.body));
    db.characters.insert(req.body, function(err, doc) {
        res.json(doc);
    }) 
});

app.delete('/characters/:id', function(req, res) {
    var id = req.params.id;
    console.log("from server the id is: " + id);
    db.characters.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
        res.json(doc);
    });
});

app.put('/characters/:id', function(req, res){
    var id = req.params.id;
    console.log("Request body was: " + req.body.con);
    db.characters.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, occupation: req.body.occupation, hp: req.body.hp, 
        sanity: req.body.sanity, 
        str: req.body.str, 
        dex: req.body.dex, 
        con: req.body.con }}, 
        new: true}, function (err, doc) {
            res.json(doc);
        });
    });
    // console.log(req.body.name);
    // res.send("OK");

    app.get('/agent/:id', function (req, res) {
        var id = req.params.id;
        console.log("id is: " + id);

        db.characters.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
            console.log("From get " + doc);
            res.json(doc);
        });
    });

app.listen(3000);
console.log("Server is running on port 3000.");