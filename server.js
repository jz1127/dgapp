// ./src/server.js

// importing the dependencies
const express = require('express');
var app = express();
var mongojs = require('mongojs');
// const { request } = require('express');
var db = mongojs('dgappdb', ['characters']);
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');

var sortByProperty = function (property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? -1 : 1));
    };
};

app.use(express.static(__dirname + "/public"));
app.use('/client', express.static(__dirname + '/node_modules/ng-file-upload/dist/'));
// app.use(bodyParser.json());

/* Here we are doing two things, we are allowing our express server to accept cross-origin request from another server. (In this case localhost:80)
Alternatively we are asking express to expose client folder as a static path, in this way we can run our AngularJS client code on the same express server (cross-origin wont be required if we follow this).
https://ciphertrick.com/file-upload-with-angularjs-and-nodejs/
*/

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/** Serving from the same express Server
No cors required */
app.use(express.static('../client'));
app.use(bodyParser.json());

/* Here we are defining Multer storage settings. Multer supports two type of storage, viz. memory and disk.
We are using diskStorage for this tutorial, as memory storage might give problems if the file is too large or multiple files are uploaded very fast.
In the storage setting we give the destination path to save our files. We also rename our file.
I’m appending datetime to the name in order to avoid any duplicate naming conflict.
Also we need to append the file extension as by default Multer would save the file without any extension. */

var newName = ""

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/img/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        newName = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]
        cb(null, newName)
    }
});

/* Now we create a Multer instance by calling multer and passing our options into it.
At the same time we specify the type of upload, that is, if it ismultiple files or single.
In our case its single, and the parameter ('file') should normally be the name of the input
field in our html form but in our case since we are using ngFileUpload in AngularJS it
should match the key which holds the file object in the post request. */
var upload = multer({ //multer settings
                storage: storage
            }).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json({error_code:0,err_desc:null,modname:newName});
    })
});

// Character APIs need to be changed to Agent APIs

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
    // console.log("Request body was: " + JSON.stringify(req.body));

    const newBody = Object.keys(req.body).reduce((object, key) => {        
        if (key != "_id") {
          object[key] = req.body[key];
        }
        return object
      }, {});

    for (const key in newBody) {
        // console.log(newBody[key]);
        if (null == newBody[key] || "" == newBody[key]) {
            // console.log("Yes it is " + key);
            delete newBody[key];
        }
    }

    db.characters.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: newBody}, 
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

    // WEAPONS APIS
    app.get('/weapons', function(req, res) {
        console.log('Weapons got a get request');
    
        db.weapons.find(function (err, docs) {
            // console.log("From weapons get " + docs);
            res.json(docs.sort(sortByProperty('name')));
        }, [{timestamp: mongojs.ObjectId().getTimestamp()}]);
    });
    
    app.post('/weapons', function(req, res) {
        console.log(JSON.stringify(req.body));
        db.weapons.insert(req.body, function(err, doc) {
            res.json(doc);
        }) 
    });

    app.put('/weapons/:id', function(req, res){
        var id = req.params.id;
        console.log("Request body was: " + JSON.stringify(req.body));
    
        const newBody = Object.keys(req.body).reduce((object, key) => {        
            if (key != "_id") {
              object[key] = req.body[key];
            }
            return object
          }, {});
    
        for (const key in newBody) {
            console.log(newBody[key]);
            if (null == newBody[key] || "" == newBody[key]) {
                // console.log("Yes it is " + key);
                delete newBody[key];
            }
        }
    
        console.log("newBody: " + JSON.stringify(newBody));
    
    
        db.weapons.findAndModify({query: {_id: mongojs.ObjectId(id)},
        update: {$set: newBody}, 
            new: true}, function (err, doc) {
                res.json(doc);
            });
        });

        // Testing API's and Misc
        app.get('/test', function(req, res){
            res.sendFile(path.join(__dirname + '/public/index.html'));
        });
        
        app.get('/look', function(req, res) { 
            res.send("Hello World!"); 
        });


app.listen(3000);
console.log("Server is running on port 3000.");