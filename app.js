const express = require("express"),
    path = require("path"),
    app = express(),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    mqtt = require('mqtt'),
    User = require("./models/user");

const client = mqtt.connect('mqtt://192.168.77.213'); //mqtt://broker.hivemq.com


client.on('connect', () => {
    console.log('Client connected');
});

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
let sensorPin = "";
let namesensor = "";
let username = "";
let users_id = "";
let mysort = { '_id': -1 };
let id = "";

// let temperatureReal = "";
// app.get("/on", (req, res) => {
//     User.findOne({}, { '_id': 0, 'temperature': 1 }).sort(mysort).exec((err, doc) => {
//         temperatureReal = doc.temperature
//         res.json(doc);
//     });
// });

app.get("/frequency", (req, res) => {
    User.find({ 'idMicro': microId, 'namesensor': namesensor }, { '_id': 0, 'frequency': 1 }).exec((err, doc) => {
        res.json(doc);
    });
});

app.get("/chartpie", (req, res) => {
    User.findOne({ 'idSerial': microId, 'namesensor': namesensor }, { '_id': 0, 'temperature': 1, 'humidity': 1, 'aqi': 1 }).sort(mysort).exec((err, doc) => {
        res.json(doc);
    });
});

app.get("/chartpie1", (req, res) => {
    User.findOne({ 'idSerial': microId, 'namesensor': namesensor }, { '_id': 0, 'temperature': 1, 'humidity': 1, 'aqi': 1 }).sort(mysort).exec((err, doc) => {
        res.json(doc);
    });
});

app.get("/chartarea", (req, res) => {
    User.aggregate([{ $match: { 'idSerial': microId, 'namesensor': namesensor } }, { $sort: { 'date': -1 } }, { $limit: 7 },
    { $project: { _id: 0, aqi: 1, humidity: 1, temperature: 1, date: { $dateToString: { format: '%H:%M', date: '$date' } }, current: 1 } },
    { $group: { _id: null, aqi: { $push: '$aqi' }, hum: { $push: '$humidity' }, temp: { $push: '$temperature' }, date: { $push: '$date' }, cur: { $push: '$current' } } }
    ]).exec((err, doc) => {
        res.json(doc);
    });
});

app.get("/chartbar", (req, res) => {
    User.aggregate([{ $match: { 'idSerial': microId, 'namesensor': namesensor } }, { $sort: { 'date': -1 } }, { $limit: 7 },
    { $project: { _id: 0, aqi: 1, humidity: 1, temperature: 1, date: { $dateToString: { format: '%H:%M', date: '$date' } }, current: 1 } },
    { $group: { _id: null, aqi: { $push: '$aqi' }, hum: { $push: '$humidity' }, temp: { $push: '$temperature' }, date: { $push: '$date' }, cur: { $push: '$current' } } }
    ]).exec((err, doc) => {
        res.json(doc);
    });
});

app.get("/data", (req, res) => {
    User.find({ 'idSerial': microId, 'namesensor': namesensor }).sort(mysort).exec((err, doc) => {
        res.json(doc);
    });
});

app.get("/datatable", (req, res) => {
    User.aggregate([{ $match: { 'idSerial': microId, 'namesensor': namesensor } }, { $sort: { 'date': -1 } },
    {
        $project: {
            _id: 0, date: { $dateToString: { format: '%Y/%m/%d', date: '$date' } }, time: { $dateToString: { format: '%H:%M', date: '$date' } },
            aqi: 1, humidity: 1, temperature: 1, power: {
                $divide: [{ $trunc: { $multiply: [{ $toDouble: "$current" }, { $toInt: "$power" }] } }, 1
                ]
            }
        }
    }]).exec((err, doc) => {
        res.json(doc);
    });
});

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get("/", (req, res) => {
    res.render("login", { title: "login" });
});

app.get("/charts", isLoggedIn, (req, res) => {
    User.find({ 'idSerial': microId, 'namesensor': namesensor }).sort(mysort).exec((err, doc) => {
        res.render("charts", { title: "charts", currentUser: req.user, users: doc, temp: doc[0] });
    });
});

app.get("/:id/dashboard1", isLoggedIn, (req, res) => {
    namesensor = req.params.id;
    User.find({ 'idSerial': microId, 'namesensor': namesensor }).sort(mysort).exec((err, doc) => {
        res.render("dashboard1", { title: "dashboard1", currentUser: req.user, users: doc, temp: doc[0] });
    });
});

app.get("/dashboard1", isLoggedIn, (req, res) => {
    User.find({ 'idSerial': microId, 'namesensor': namesensor }).sort(mysort).exec((err, doc) => {
        res.render("dashboard1", { title: "dashboard1", currentUser: req.user, users: doc, temp: doc[0] });
    });
});

app.get("/dashboard2", isLoggedIn, (req, res) => {
    User.find({ 'idSerial': microId, 'namesensor': namesensor }).sort(mysort).exec((err, doc) => {
        User.find({ 'idMicro': microId }).exec((err, doc1) => {
            User.find({ 'idMicro': microId, 'namesensor': namesensor }).sort(mysort).exec((err, doc2) => {
                res.render("dashboard2", { title: "dashboard2", currentUser: req.user, users: doc, users1: doc1, users2: doc2, temp: doc[0] });
            });
        });
    });
});

app.get("/dashboard3", isLoggedIn, (req, res) => {
    User.find({ 'idSerial': microId, 'namesensor': namesensor }).sort(mysort).exec((err, doc) => {
        res.render("dashboard3", { title: "dashboard3", currentUser: req.user, users: doc, temp: doc[0] });
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
    users_id = req.user._id;
    username = req.user.username
    User.find({ $or: [{ 'user_id': users_id }, { 'useridadmin': username }] }).exec((err, doc) => {
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
    User.aggregate([{ $match: { 'idMicro': microId } }, { $project: { _id: 0, sensorPin: 1 } }, { $group: { _id: null, sensorPin: { $push: '$sensorPin' } } }]).exec((err, doc) => {
        res.render("addSensor", { title: "addSensor", currentUser: req.user, doc: doc });
    });
});

app.get("/add-admin", isLoggedIn, (req, res) => {
    User.find({ $and: [{ 'user_id': users_id }, { 'serialnumber': microId }] }).exec((err, doc) => {
        id = doc
        res.render("addAdmin", { title: "addAdmin", currentUser: req.user, doc: doc });
    });
});

app.get("/:id", isLoggedIn, (req, res) => {
    microId = req.params.id;
    User.find({ 'idMicro': microId }).exec((err, doc) => {
        res.render("tablessensor", {
            title: "tablessensor",
            currentUser: req.user,
            users: doc,
        });
    });
});

app.get("/delete/:id", (req, res) => {
    const user_id = req.user._id;
    User.findByIdAndDelete(user_id).exec(
        (err) => {
            if (err) console.log(err);
            res.redirect("/logout");
        }
    );
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

app.get("/deleteAdmin/:id", (req, res) => {
    let data = ({}, { $unset: { 'useridadmin': '' } })
    User.findByIdAndUpdate(id, data).exec(
        (err) => {
            if (err) console.log(err);
            res.redirect("/index");
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
            idline: req.body.idline,
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

app.post("/switch1", (req, res) => {
    if (req.body.onoff1 == undefined) {
        req.body.onoff1 = "false";
    }
    client.publish(req.body.pinMQTT, req.body.onoff1);
    let _id = req.body._id;
    let data = ({ $and: [{ 'namesensor': req.body.namesensor, 'idMicro': req.body.idMicro }] }, { $set: { 'onoff1': req.body.onoff1 } })
    User.findByIdAndUpdate(_id, data).exec(
        (err) => {
            if (err) console.log(err);
            res.status(204).send();
        }
    );
});

app.post("/switch2", (req, res) => {
    if (req.body.onoff2 == undefined) {
        req.body.onoff2 = "false";
    }
    client.publish(req.body.pinMQTT, req.body.onoff2);
    let _id = req.body._id;
    let data = ({ $and: [{ 'namesensor': req.body.namesensor, 'idMicro': req.body.idMicro }] }, { $set: { 'onoff2': req.body.onoff2 } })
    User.findByIdAndUpdate(_id, data).exec(
        (err) => {
            if (err) console.log(err);
            res.status(204).send();
        }
    );
});

app.post("/autoOn", (req, res) => {
    let _id = req.body._id;
    let data = ({ $and: [{ 'namesensor': req.body.namesensor, 'idMicro': req.body.idMicro }] }, { $set: { 'autoOn': req.body.autoOn } })
    User.findByIdAndUpdate(_id, data).exec(
        (err) => {
            if (err) console.log(err);
            res.status(204).send();
        }
    );
});

app.post("/autoOff", (req, res) => {
    let _id = req.body._id;
    let data = ({ $and: [{ 'namesensor': req.body.namesensor, 'idMicro': req.body.idMicro }] }, { $set: { 'autoOff': req.body.autoOff } })
    User.findByIdAndUpdate(_id, data).exec(
        (err) => {
            if (err) console.log(err);
            res.status(204).send();
        }
    );
});

app.post("/insertMicro", (req, res) => {
    const user_id = req.user._id;
    let data = new User({
        user_id: user_id,
        namemicrocontroller: req.body.namemicrocontroller,
        serialnumber: req.body.serialnumber,
    });
    User.saveUser(data, (err) => {
        if (err) console.log(err);
        res.redirect("tables");
    });
});

app.post("/insertSensor", (req, res) => {
    let data = new User({
        idMicro: microId,
        namesensor: req.body.namesensor,
        sensorPin: req.body.sensorPin,
        frequency: 10000,
        onoff1: "false",
        onoff2: "false",
        autoOn: "Not Set",
        autoOff: "Not Set",
    });
    User.saveUser(data, (err) => {
        if (err) console.log(err);
        res.redirect("tablessensor");
    });
});

app.post("/insertadmin", (req, res) => {
    let data = ({ $set: { 'useridadmin': req.body.useridadmin } })
    User.findByIdAndUpdate(id, data).exec(
        (err) => {
            if (err) console.log(err);
            res.redirect("tablessensor");
        }
    );
});

app.post("/update", (req, res) => {
    const update_id = req.user._id;
    let data = {
        email: req.body.email,
        idline: req.body.idline,
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

app.post("/updatefrequency", (req, res) => {
    let _id = req.body._id;
    let data = ({ $and: [{ 'namesensor': req.body.namesensor, 'idMicro': req.body.idMicro }] }, { $set: { 'frequency': req.body.frequency } })
    User.findByIdAndUpdate(_id, data).exec(
        (err) => {
            if (err) console.log(err);
            res.status(204).send();
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

client.on('message', (topic, message) => {
    console.log(`Received message on ${topic}: ${message.toString()}`);
});

app.listen(process.env.PORT || 1111, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Server Started At Port 1111");
    }
});