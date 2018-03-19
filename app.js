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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");


//================================
//ROUTES
//================================


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", isLoggedin, function (req, res) {
    res.render("secret");
});

//================================
//AUTH ROUTES
//================================

//REGISTER
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.register(new User({
        username: username
    }), password, function (err, user) {
        if (err) {
            console.log(err);
            return res.redirect("register");
        }

        passport.authenticate("local")(req, res, function () {
            res.redirect("secret");
            console.log(user);
        });

    });
});


//LOGIN
//middleware
app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"

}), function (req, res) {

});

//LOGOUT
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

//custom middleware

function isLoggedin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");
}



app.listen("3000", function () {
    console.log("Server started on port 3000");
});