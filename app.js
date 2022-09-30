const console = require("console");

const express = require("express"),
    path = require("path"),
    app = express(),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");

app.use(
    require("express-session")({
        secret: "Project C02", //decode or encode session
        resave: false,
        saveUninitialized: false,
    })
);

passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(new LocalStrategy(User.authenticate()));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

//=======================
//      R O U T E S
//=======================

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.render("login", { title: "login" });
});

app.get("/charts", isLoggedIn, (req, res) => {
    res.render("charts", { title: "charts", currentUser: req.user });
});

app.get("/dashboard1", isLoggedIn, (req, res) => {
    res.render("dashboard1", { title: "dashboard1", currentUser: req.user });
});

app.get("/dashboard2", isLoggedIn, (req, res) => {
    res.render("dashboard2", { title: "dashboard2", currentUser: req.user });
});

app.get("/dashboard3", isLoggedIn, (req, res) => {
    res.render("dashboard3", { title: "dashboard3", currentUser: req.user });
});

app.get("/index", isLoggedIn, (req, res) => {
    res.render("index", { title: "index", currentUser: req.user });
});

app.get("/profile", isLoggedIn, (req, res) => {
    const edit_id = req.user._id;
    User.findOne({ _id: edit_id }).exec((err, doc) => {
        res.render("profile", { title: "profile", currentUser: req.user });
    });
});

app.get("/register", (req, res) => {
    res.render("register", { title: "register" });
});

app.get("/security", isLoggedIn, (req, res) => {
    res.render("security", { title: "security", currentUser: req.user });
});

app.get("/tables", isLoggedIn, (req, res) => {
    const users_id = req.user._id;
    User.find({ user_id: users_id }).exec((err, doc) => {
        res.render("tables", {
            title: "tables",
            currentUser: req.user,
            users: doc,
        });
    });
});

app.get("/tablessensor", isLoggedIn, (req, res) => {
    const User_id = req.params
    console.log(`User ${User_id}`);
    User.find({ _id: User_id }).exec((err, doc) => {
        res.render("tablessensor", {
            title: "tablessensor",
            currentUser: req.user,
            users: doc,
        });
    });
});

app.get("/add-Micro", isLoggedIn, (req, res) => {
    res.render("addMicrocontroller", {
        title: "addMicrocontroller",
        currentUser: req.user,
    });
});

// app.get("/add-Sensor", isLoggedIn, (req, res) => {
//     User.find( {pro: { _id: 0, serialnumber: 1 }} ).exec((err, doc) => {
//         console.log(doc + ' doc /add-Sensor')
//         console.log(doc)
//         res.render("addSensor", {
//             title: "addSensor",
//             currentUser: req.user,
//             users: doc,
//         });
//     });
// });

app.get("/:id/add-Sensor", isLoggedIn, (req, res) => { // ทดสอบ
    const doc = req.params.id;
    User.find( doc ).exec((err, doc) => {
        res.render("addSensor", {
            title: "addSensor",
            currentUser: req.user,
            users: doc,
        });
    });
});

app.get("/:id", (req, res) => {
    const User_id = req.params.id;
    console.log(User_id + ' User_id');
    res.render("addSensor");
});

app.get("/delete/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id, { useFindAndModify: false }).exec(
        (err) => {
            if (err) console.log(err);
            res.redirect("/tables");
        }
    );
});

app.post(
    "/",
    passport.authenticate("local", {
        successRedirect: "/index",
        failureRedirect: "/",
    })
);

app.post("/register", (req, res) => {
    User.register(
        new User({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
        }),
        req.body.password,
        function (password) {
            if (password.length < 8) {
                res.redirect("/register");
            }
            passport.authenticate("local")(req, res, function () {
                res.redirect("/");
            });
        }
    );
});

app.post("/insertMicro", (req, res) => {
    const user_id = req.user._id;
    let data = new User({
        user_id: user_id,
        serialnumber: req.body.serialnumber,
        namemicrocontroller: req.body.namemicrocontroller,
    });
    User.saveUser(data, (err) => {
        if (err) console.log(err);
        res.redirect("tables");
    });
});

app.post("/insertSensor", (req, res) => {
    let data = new User({
        serialnumber: req.body.serialnumber,
        namesensor: req.body.sensor,
    });
    User.saveUser(data, (err) => {
        if (err) console.log(err);
        res.redirect("tablessensor");
    });
});

app.post("/update", (req, res) => {
    const update_id = req.user._id;
    let data = {
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    };
    User.findByIdAndUpdate(update_id, data, { useFindAndModify: false }).exec(
        (err) => {
            if (err) console.log(err);
            res.redirect("/index");
        }
    );
});

app.get("/delete", (req, res) => {
    User.findByIdAndDelete(req.user._id, { useFindAndModify: false }).exec(
        (err) => {
            if (err) console.log(err);
            res.redirect("/");
        }
    );
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

//Listen On Server
app.listen(process.env.PORT || 1111, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Server Started At Port 1111");
    }
});
