var express = require('express');
var app = express();

//Importing The Schema
const subjectsData = require('./models/items.js');
const signUpData = require('./models/signUpSchema.js');

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

const sessions = require('express-session');

app.use(sessions({
    cookieName: "sessions",
    secret: "peednasnamhskalramuk9991",
    saveUninitialized:true,
    resave: false
}));

var session;

// Creating Router For HomePage
app.get('/' , function(req,res){
    session=req.session;
    if(session.user){
        res.sendFile(__dirname + "/pages/homepage.html")
    }
    else{
        res.sendFile(__dirname + "/pages/login.html")
    }
     

})

// Creating Router For SingnUp Page
app.get('/signup' , function(req,res){
    res.sendFile(__dirname + "/pages/signup.html")
})
// Creating Router For Login Page
app.get('/login' , function(req,res){
    session=req.session;
    if(session.user){
        res.send("Welcome User <a href=\'/'>Click to go for HomePage</a>");
    }else
    res.sendFile(__dirname + '/pages/login.html');
})

// Creating Router For logout
app.get('/logout' , function(req,res){
    req.session.destroy();
    res.redirect("/login")
})

//Posting Users Data Into MongoDB
app.post("/sendData" , function(req,res){
    console.log(req.body);
    var obj = new signUpData({
        UserName:req.body.UserName,
        Email:req.body.Email,
        Password:req.body.Password,
    })
    signUpData.findOne({ $or: [{Email: req.body.Email } , {Password:req.body.Password}] }, function(err,docs){
        if(err || docs==null){
            console.log(err)
            obj.save(function(err, results) {
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

app.post('/loginData', function(req,res){
    session=req.session;
    console.log(req.body);
    
    signUpData.findOne({Email:req.body.Email, Password:req.body.Password}, function(err,docs){
        if(err || docs==null){
            //console.log(err)
            res.sendStatus(500)
        } 
        else{
            // session=req.session;
            session.user=docs;
            res.send(docs);
        }
    })
});




app.get('/send' , function(req,res){
     res.sendFile(__dirname + "/pages/home.html")

})

//Posting Users Data Into MongoDB
app.post("/Data" , function(req,res){
    console.log(req.body);
    var obj = new subjectsData({
        subjectId:req.body.subjectId,
        subjectName:req.body.subjectName,
        subjectCode:req.body.subjectCode,
        professorName:req.body.professorName,
        professorDegree:req.body.professorDegree,
    })
    subjectsData.findOne({ $or: [{subjectId:req.body.subjectId }, {subjectName:req.body.subjectName}]}, function(err,docs){
        if(err || docs==null){
            console.log(err)
            obj.save(function(err, results) {
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