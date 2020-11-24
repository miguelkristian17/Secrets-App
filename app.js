//jshint esversion:6

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose') 
const encypt = require ('mongoose-encryption')
const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded ({ extended: true}))
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/secretsDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get('/', function(req, res) {
    res.render('home')
})

app.get('/register', function(req, res) {
    res.render('register')
})

app.get('/login', function(req, res) {
    res.render('login')
})

app.post('/register', function(req,res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if(err){
            res.send(err)
        } else {
            res.render('secrets')
        }
    })
})

app.post('/login', function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, result){
        if(err){
            res.send(err);
        } else {
            if(result){
                if(result.password === password){
                    res.render("secrets");
                }
            }
        }
    })
})
app.listen(3000, function() {
    console.log("Server started on port 3000")
})
