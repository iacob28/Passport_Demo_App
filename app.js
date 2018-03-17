var express               = require("express"),    
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    expressSession        = require("express-session")    
    User                  = require("./models/users");

var app = express();

mongoose.connect('mongodb://localhost/passport_app_demo');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to DB !");

});

app.use(expressSession({
    secret: "Aceasta este o aplicatie demo Passport",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");


//================================


app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", function(req, res){
    res.render("secret");
});

app.listen("3000", function(){
    console.log("Server started on port 3000");
});