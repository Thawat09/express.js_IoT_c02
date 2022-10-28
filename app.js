const express = require("express"),
    path = require("path"),
    app = express(),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");

app.use(
    require("express-session")({
        secret: "Project C02",
        resave: true,
        saveUninitialized: true,
    })
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

//=======================
//      R O U T E S
//=======================

let microId = "";
let sensorId = "";
let data = "";

app.get("/chart", (req, res) => {
    res.json(data);
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.render("login", { title: "login" });
});

app.get("/charts", isLoggedIn, (req, res) => {
    var mysort = { '_id': -1 };
    User.find({ 'idSerial': sensorId }).sort(mysort).exec((err, doc) => {
        data = doc
        res.render("charts", { title: "charts", currentUser: req.user, users: doc, temp: data[0] });
    });
});

app.get("/:id/dashboard1", isLoggedIn, (req, res) => {
    sensorId = req.params.id;
    var mysort = { '_id': -1 };
    User.find({ 'idSerial': sensorId }).sort(mysort).exec((err, doc) => {
        data = doc
        res.render("dashboard1", {
            title: "dashboard1", currentUser: req.user, users: doc, temp: data[0]
        });
    });
});

app.get("/dashboard1", isLoggedIn, (req, res) => {
    var mysort = { '_id': -1 };
    User.find({ 'idSerial': sensorId }).sort(mysort).exec((err, doc) => {
        data = doc
        res.render("dashboard1", { title: "dashboard1", currentUser: req.user, users: doc, temp: data[0] });
    });
});

app.get("/dashboard2", isLoggedIn, (req, res) => {
    var mysort = { '_id': -1 };
    User.find({ 'idSerial': sensorId }).sort(mysort).exec((err, doc) => {
        data = doc
        res.render("dashboard2", { title: "dashboard2", currentUser: req.user, users: doc, temp: data[0] });
    });
});

app.get("/dashboard3", isLoggedIn, (req, res) => {
    var mysort = { '_id': -1 };
    User.find({ 'idSerial': sensorId }).sort(mysort).exec((err, doc) => {
        data = doc
        res.render("dashboard3", { title: "dashboard3", currentUser: req.user, users: doc, temp: data[0] });
    });
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
    User.find({ 'user_id': users_id }).exec((err, doc) => {
        res.render("tables", {
            title: "tables",
            currentUser: req.user,
            users: doc,
        });
    });
});

app.get("/tablessensor", isLoggedIn, (req, res) => {
    User.find({ 'idMicro': microId }).exec((err, doc) => {
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

app.get("/add-Sensor", isLoggedIn, (req, res) => {
    res.render("addSensor", {
        title: "addSensor",
        currentUser: req.user,
    });
});

app.get("/:id", (req, res) => {
    microId = req.params.id;
    User.find({ 'idMicro': microId }).exec((err, doc) => {
        res.render("tablessensor", {
            title: "tablessensor",
            currentUser: req.user,
            users: doc,
        });
    });
});

app.get("/deleteMicro/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id, { useFindAndModify: false }).exec(
        (err) => {
            if (err) console.log(err);
            res.redirect("/tables");
        }
    );
});

app.get("/deleteSensor/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id, { useFindAndModify: false }).exec(
        (err) => {
            if (err) console.log(err);
            res.redirect("/tablessensor");
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
        namemicrocontroller: req.body.namemicrocontroller,
    });
    User.saveUser(data, (err) => {
        if (err) console.log(err);
        res.redirect("tables");
    });
});

app.post("/insertSensor", (req, res) => {
    let data = new User({
        idMicro: microId,
        serialnumber: req.body.serialnumber,
        namesensor: req.body.namesensor,
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

app.post("/updatePassword", async (req, res) => {
    const user_id = req.user._id
    User.findById(user_id, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            user.changePassword(req.body.currentPassword,
                req.body.newPassword, function (err) {
                    if (err) {
                        res.status(500).send('Something went wrong. Try again');
                    } else {
                        res.redirect("/logout");
                    }
                });
        }
    });
});

app.get("/delete", (req, res) => {
    User.findByIdAndDelete(req.user._id, { useFindAndModify: false }).exec(
        (err) => {
            if (err) console.log(err);
            res.redirect("/logout");
        }
    );
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

app.listen(process.env.PORT || 1111, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Server Started At Port 1111");
    }
});