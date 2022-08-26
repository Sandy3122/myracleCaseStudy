var express = require('express');
var app = express();

//Importing The Schema
const subjectsData = require('./models/items.js');


app.use(express.json());
app.use(express.urlencoded({extended:false}));


//Mongodb Database Connection
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Sandeep1999:Sandeep3122@sandeep.nlcna.mongodb.net/MyracleCaseStudy?retryWrites=true&w=majority',)
.then(() => {
    console.log("Successfully Connected To MongoDB Database.");
}).catch((e) => {
    console.log("Not Connected To MongoDB Database.");
})
const connection = mongoose.connection;


// Creating Router For HomePage
app.get('/' , function(req,res){
     res.sendFile(__dirname + "/homepage.html")

})
app.get('/send' , function(req,res){
     res.sendFile(__dirname + "/home.html")

})

//Posting Users Data Into MongoDB
app.post("/sendData" , function(req,res){
    console.log(req.body);
    var subjects = new subjectsData({
        subjectId:req.body.subjectId,
        subjectName:req.body.subjectName,
        subjectCode:req.body.subjectCode,
        professorName:req.body.professorName,
        professorDegree:req.body.professorDegree,
    })
    subjectsData.findOne({ $or: [{subjectId: req.body.subjectId }, {subjectName:req.body.subjectName}, {subjectCode:req.body.subjectCode}, {professorName:req.body.professorName}, {professorDegree:req.body.professorDegree}]}, function(err,docs){
        if(err || docs==null){
            console.log(err)
            subjects.save(function(err, results) {
                if(results){
                   console.log("results"+ results);
                    res.send(results);
                }else{
                    console.log(err)
                    res.send(err);
                }
            })
        }
        else{
            res.sendStatus(500);
        }
    })
});

app.get('/getItems', function(req,res){
    subjectsData.find(function(err,docs){
        if(err || docs==null){
            console.log(err);
            res.sendStatus(500)
        } 
        else if(docs!=undefined){
            console.log(docs);
            res.send(docs)
        }
    })
});

app.post('/search' , function(req,res){
    console.log(req.body)
    const searchField = req.body.searchItem;
    subjectsData.find({$or:[{subjectId:{$regex: searchField, $options: '$i'}}, {subjectName:{$regex: searchField, $options: '$i'}}, {subjectCode:{$regex: searchField, $options: '$i'}}, {professorName:{$regex: searchField, $options: '$i'}}, {professorDegree:{$regex: searchField, $options: '$i'}}]})
    .then(data => {
        res.send(data);
    })

})
app.listen(4000, ()=> console.log('Successfully Server Started'))