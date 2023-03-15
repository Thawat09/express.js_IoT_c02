const express = require("express"),
    path = require("path"),
    app = express(),
    https = require("https"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    mqtt = require('mqtt'),
    User = require("./models/user");


const PORT = process.env.PORT || 3000
const TOKEN = '9UuuOoemAOcBwMH+8qg7ltt78oDQ13EXMbO6BvDkTST812/gvBvT3iaUQhrG1Jjc3DNjuQ360O2Ivp2k7n74xVrL+wjPGR3YiTa1l7mUWBScKqhZqyMY5SKX9s+Q5KPcgDxnEovactioJHpTRsHiBAdB04t89/1O/w1cDnyilFU='
const client = mqtt.connect('mqtt://20.213.75.176'); //mqtt://broker.hivemq.com

client.on('connect', () => {
    console.log('Client connected');
});

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
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

app.get("/frequency", (req, res) => {
    User.find({ 'idMicro': microId, 'namesensor': namesensor }, { '_id': 0, 'frequency': 1 }).exec((err, doc) => {
        let seconds = ""
        doc.map((doc1) => {
            seconds = doc1['frequency']
        })
        res.json(seconds);
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
        User.find({ 'idMicro': microId, 'namesensor': namesensor }).sort(mysort).exec((err, doc2) => {
            User.find({ $or: [{ 'user_id': users_id }, { 'useridadmin': username }] }).exec((err, doc1) => {
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
        User.find({ $or: [{ 'user_id': users_id }, { 'useridadmin': username }] }).exec((err, doc1) => {
            res.render("addSensor", { title: "addSensor", currentUser: req.user, doc: doc, doc1: doc1 });
        });
    });
});

app.get("/add-admin", isLoggedIn, (req, res) => {
    User.find({ $and: [{ 'user_id': users_id }, { 'serialnumber': microId }] }).exec((err, doc) => {
        User.find({ $or: [{ 'user_id': users_id }, { 'useridadmin': username }] }).exec((err, doc1) => {
            id = doc
            res.render("addAdmin", { title: "addAdmin", currentUser: req.user, doc: doc, doc1: doc1 });
        });
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
            res.redirect("/add-admin");
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
            res.redirect("add-admin");
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

let user_id1, _idMicro, idSerial, namesensor1, status, color, status1, color1 = ""

app.post("/webhook", (req, res) => {
    console.log('req.body =>', JSON.stringify(req.body, null, 2))
    res.send("HTTP POST request sent to the webhook URL!")
    const user_message = req.body.events[0]?.message.text

    //---------------------------------------------------------------------------//
    if (user_message?.split(' ')[0] === "Login") {
        // Message data, must be stringified
        const dataString = JSON.stringify({
            replyToken: req.body.events[0].replyToken,
            messages: [
                {
                    "type": "text",
                    "text": "Enter ID Line to login.!!!"
                }
            ]
        })
        // Request header
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        }
        // Options to pass into the request
        const webhookOptions = {
            "hostname": "api.line.me",
            "path": "/v2/bot/message/reply",
            "method": "POST",
            "headers": headers,
            "body": dataString
        }
        // Define request
        const request = https.request(webhookOptions, (res) => {
            res.on("data", (d) => {
                process.stdout.write(d)
            })
        })
        // Handle error
        request.on("error", (err) => {
            console.error(err)
        })
        // Send data
        request.write(dataString)
        request.end()
    }

    //---------------------------------------------------------------------------//
    else if (user_message?.split(' ')[0] === "true1") {
        let value = "true"
        client.publish('relay1', value);
        let data = ({ $and: [{ 'namesensor': namesensor1, 'idMicro': idSerial }] }, { $set: { 'onoff1': value } })
        User.findByIdAndUpdate(_idMicro, data).exec(
            (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    // Message data, must be stringified
                    const dataString = JSON.stringify({
                        replyToken: req.body.events[0].replyToken,
                        messages: [
                            {
                                "type": "text",
                                "text": "The selected device is turned on.!!!"
                            }
                        ]
                    })
                    // Request header
                    const headers = {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + TOKEN
                    }
                    // Options to pass into the request
                    const webhookOptions = {
                        "hostname": "api.line.me",
                        "path": "/v2/bot/message/reply",
                        "method": "POST",
                        "headers": headers,
                        "body": dataString
                    }
                    // Define request
                    const request = https.request(webhookOptions, (res) => {
                        res.on("data", (d) => {
                            process.stdout.write(d)
                        })
                    })
                    // Handle error
                    request.on("error", (err) => {
                        console.error(err)
                    })
                    // Send data
                    request.write(dataString)
                    request.end()
                }
            }
        );
    }

    //---------------------------------------------------------------------------//
    else if (user_message?.split(' ')[0] === "true2") {
        let value = "true"
        client.publish('relay2', value);
        let data = ({ $and: [{ 'namesensor': namesensor1, 'idMicro': idSerial }] }, { $set: { 'onoff2': value } })
        User.findByIdAndUpdate(_idMicro, data).exec(
            (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    // Message data, must be stringified
                    const dataString = JSON.stringify({
                        replyToken: req.body.events[0].replyToken,
                        messages: [
                            {
                                "type": "text",
                                "text": "The selected device is turned on.!!!"
                            }
                        ]
                    })
                    // Request header
                    const headers = {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + TOKEN
                    }
                    // Options to pass into the request
                    const webhookOptions = {
                        "hostname": "api.line.me",
                        "path": "/v2/bot/message/reply",
                        "method": "POST",
                        "headers": headers,
                        "body": dataString
                    }
                    // Define request
                    const request = https.request(webhookOptions, (res) => {
                        res.on("data", (d) => {
                            process.stdout.write(d)
                        })
                    })
                    // Handle error
                    request.on("error", (err) => {
                        console.error(err)
                    })
                    // Send data
                    request.write(dataString)
                    request.end()
                }
            }
        );
    }

    //---------------------------------------------------------------------------//
    else if (user_message?.split(' ')[0] === "false1") {
        let value = "false"
        client.publish('relay1', value);
        let data = ({ $and: [{ 'namesensor': namesensor1, 'idMicro': idSerial }] }, { $set: { 'onoff1': value } })
        User.findByIdAndUpdate(_idMicro, data).exec(
            (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    // Message data, must be stringified
                    const dataString = JSON.stringify({
                        replyToken: req.body.events[0].replyToken,
                        messages: [
                            {
                                "type": "text",
                                "text": "The selected device is turned off.!!!"
                            }
                        ]
                    })
                    // Request header
                    const headers = {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + TOKEN
                    }
                    // Options to pass into the request
                    const webhookOptions = {
                        "hostname": "api.line.me",
                        "path": "/v2/bot/message/reply",
                        "method": "POST",
                        "headers": headers,
                        "body": dataString
                    }
                    // Define request
                    const request = https.request(webhookOptions, (res) => {
                        res.on("data", (d) => {
                            process.stdout.write(d)
                        })
                    })
                    // Handle error
                    request.on("error", (err) => {
                        console.error(err)
                    })
                    // Send data
                    request.write(dataString)
                    request.end()
                }
            }
        );
    }

    //---------------------------------------------------------------------------//
    else if (user_message?.split(' ')[0] === "false2") {
        let value = "false"
        client.publish('relay2', value);
        let data = ({ $and: [{ 'namesensor': namesensor1, 'idMicro': idSerial }] }, { $set: { 'onoff2': value } })
        User.findByIdAndUpdate(_idMicro, data).exec(
            (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    // Message data, must be stringified
                    const dataString = JSON.stringify({
                        replyToken: req.body.events[0].replyToken,
                        messages: [
                            {
                                "type": "text",
                                "text": "The selected device is turned off.!!!"
                            }
                        ]
                    })
                    // Request header
                    const headers = {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + TOKEN
                    }
                    // Options to pass into the request
                    const webhookOptions = {
                        "hostname": "api.line.me",
                        "path": "/v2/bot/message/reply",
                        "method": "POST",
                        "headers": headers,
                        "body": dataString
                    }
                    // Define request
                    const request = https.request(webhookOptions, (res) => {
                        res.on("data", (d) => {
                            process.stdout.write(d)
                        })
                    })
                    // Handle error
                    request.on("error", (err) => {
                        console.error(err)
                    })
                    // Send data
                    request.write(dataString)
                    request.end()
                }
            }
        );
    }

    //---------------------------------------------------------------------------//
    else {
        if (user_message) {
            User.find({ 'idline': user_message }, { '_id': 1 }).then(function (doc) {
                if (doc.length > 0) {
                    user_id1 = doc.map((value) => value._id);
                    User.find({ 'user_id': user_id1 }, { '_id': 0, 'serialnumber': 1 }).then(function (doc1) {
                        User.find({ 'user_id': user_id1 }, { '_id': 0, 'namemicrocontroller': 1 }).then(function (doc2) {
                            if (doc1.length > 0) {
                                for (let i = 0; i < doc1.length; i++) {
                                    doc1[i] = doc1[i].toString().replace(/[^\d.]/g, '');
                                    if (doc1.length > 0) {
                                        if (doc1.length > 1) {
                                            if (doc1.length > 2) {
                                                if (doc.length > 3) {
                                                }
                                                else {
                                                    var footer = (
                                                        {
                                                            "type": "box",
                                                            "layout": "vertical",
                                                            "spacing": "sm",
                                                            "contents": [
                                                                {
                                                                    "type": "button",
                                                                    "style": "primary",
                                                                    "height": "sm",
                                                                    "action": {
                                                                        "type": "message",
                                                                        "label": "Serial " + doc[0] + '\n',
                                                                        "text": doc[0]
                                                                    }
                                                                },
                                                                {
                                                                    "type": "button",
                                                                    "style": "primary",
                                                                    "height": "sm",
                                                                    "action": {
                                                                        "type": "message",
                                                                        "label": "Serial " + doc[1] + '\n',
                                                                        "text": doc[1]
                                                                    }
                                                                },
                                                                {
                                                                    "type": "button",
                                                                    "style": "primary",
                                                                    "height": "sm",
                                                                    "action": {
                                                                        "type": "message",
                                                                        "label": "Serial " + doc[2] + '\n',
                                                                        "text": doc[2]
                                                                    }
                                                                },
                                                                {
                                                                    "type": "box",
                                                                    "layout": "vertical",
                                                                    "contents": [],
                                                                    "margin": "sm"
                                                                }
                                                            ],
                                                            "flex": 0
                                                        }
                                                    )
                                                }
                                            }
                                            else {
                                                var footer = (
                                                    {
                                                        "type": "box",
                                                        "layout": "vertical",
                                                        "spacing": "sm",
                                                        "contents": [
                                                            {
                                                                "type": "button",
                                                                "style": "primary",
                                                                "height": "sm",
                                                                "action": {
                                                                    "type": "message",
                                                                    "label": "Serial " + doc1[0] + '\n',
                                                                    "text": doc1[0]
                                                                }
                                                            },
                                                            {
                                                                "type": "button",
                                                                "style": "primary",
                                                                "height": "sm",
                                                                "action": {
                                                                    "type": "message",
                                                                    "label": "Serial " + doc1[1] + '\n',
                                                                    "text": doc1[1]
                                                                }
                                                            },
                                                            {
                                                                "type": "box",
                                                                "layout": "vertical",
                                                                "contents": [],
                                                                "margin": "sm"
                                                            }
                                                        ],
                                                        "flex": 0
                                                    }
                                                )
                                            }
                                        }
                                        else {
                                            var footer = (
                                                {
                                                    "type": "box",
                                                    "layout": "vertical",
                                                    "spacing": "sm",
                                                    "contents": [
                                                        {
                                                            "type": "button",
                                                            "style": "primary",
                                                            "height": "sm",
                                                            "action": {
                                                                "type": "message",
                                                                "label": "Serial " + doc1[0] + '\n',
                                                                "text": doc1[0]
                                                            }
                                                        },
                                                        {
                                                            "type": "box",
                                                            "layout": "vertical",
                                                            "contents": [],
                                                            "margin": "sm"
                                                        }
                                                    ],
                                                    "flex": 0
                                                }
                                            )
                                        }
                                    }
                                    else {
                                        var footer = (
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "spacing": "sm",
                                                "contents": [
                                                    {
                                                        "type": "box",
                                                        "layout": "vertical",
                                                        "contents": [],
                                                        "margin": "sm"
                                                    }
                                                ],
                                                "flex": 0
                                            }
                                        )
                                    }
                                }
                                if (doc.length > 0) {
                                    var body = {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": "Microcontroller",
                                                "weight": "bold",
                                                "size": "xl"
                                            },
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "margin": "lg",
                                                "spacing": "sm",
                                                "contents": [
                                                    {
                                                        "type": "box",
                                                        "layout": "baseline",
                                                        "spacing": "sm",
                                                        "contents": [
                                                            {
                                                                "type": "text",
                                                                "text": "Details",
                                                                "color": "#aaaaaa",
                                                                "size": "sm",
                                                                "flex": 1
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text": doc2[0]?.namemicrocontroller,
                                                                "wrap": true,
                                                                "color": "#666666",
                                                                "size": "sm",
                                                                "flex": 5
                                                            }
                                                        ]
                                                    },
                                                ]
                                            }
                                        ]
                                    }
                                }
                                if (doc.length > 0) {
                                    var header = {
                                        "type": "flex",
                                        "altText": "Flex Message",
                                        "contents": {
                                            "type": "bubble",
                                            "hero": {
                                                "type": "image",
                                                "url": "https://miro.medium.com/max/1024/1*Yu0w5T7AWg8WqjVFXwaQPg.jpeg",
                                                "size": "full",
                                                "aspectRatio": "20:13",
                                                "aspectMode": "cover",
                                                "action": {
                                                    "type": "uri",
                                                    "uri": "http://linecorp.com/"
                                                }
                                            },
                                            body,
                                            footer,
                                        }
                                    }
                                }
                                if (doc.length === 0) {
                                    var header = {
                                        "type": "text",
                                        "text": "no information found.!!!"
                                    }
                                }
                                // Message data, must be stringified
                                const dataString = JSON.stringify({
                                    replyToken: req.body.events[0].replyToken,
                                    messages: [
                                        header
                                    ]
                                })
                                // Request header
                                const headers = {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + TOKEN
                                }
                                // Options to pass into the request
                                const webhookOptions = {
                                    "hostname": "api.line.me",
                                    "path": "/v2/bot/message/reply",
                                    "method": "POST",
                                    "headers": headers,
                                    "body": dataString
                                }
                                // Define request
                                const request = https.request(webhookOptions, (res) => {
                                    res.on("data", (d) => {
                                        process.stdout.write(d)
                                    })
                                })
                                // Handle error
                                request.on("error", (err) => {
                                    console.error(err)
                                })
                                // Send data
                                request.write(dataString)
                                request.end()
                            }
                            return
                        })
                    })
                }
                return
            })
        }
        if (user_message) {
            User.find({ 'idMicro': user_message }, { '_id': 0, 'namesensor': 1 }).then(function (doc) {
                if (doc.length > 0) {
                    idSerial = req.body.events[0].message.text
                    doc = doc.map((value) => value.namesensor)
                    idSerial = req.body.events[0].message.text
                    for (let i = 0; i < doc.length; i++) {
                        if (doc.length > 0) {
                            if (doc.length > 1) {
                                if (doc.length > 2) {
                                    if (doc.length > 3) {
                                    }
                                    else {
                                        var footer = (
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "spacing": "sm",
                                                "contents": [
                                                    {
                                                        "type": "button",
                                                        "style": "primary",
                                                        "height": "sm",
                                                        "action": {
                                                            "type": "message",
                                                            "label": doc[0] + '\n',
                                                            "text": doc[0]
                                                        }
                                                    },
                                                    {
                                                        "type": "button",
                                                        "style": "primary",
                                                        "height": "sm",
                                                        "action": {
                                                            "type": "message",
                                                            "label": doc[1] + '\n',
                                                            "text": doc[1]
                                                        }
                                                    },
                                                    {
                                                        "type": "button",
                                                        "style": "primary",
                                                        "height": "sm",
                                                        "action": {
                                                            "type": "message",
                                                            "label": doc[2] + '\n',
                                                            "text": doc[2]
                                                        }
                                                    },
                                                    {
                                                        "type": "box",
                                                        "layout": "vertical",
                                                        "contents": [],
                                                        "margin": "sm"
                                                    }
                                                ],
                                                "flex": 0
                                            }
                                        )
                                    }
                                }
                                else {
                                    var footer = (
                                        {
                                            "type": "box",
                                            "layout": "vertical",
                                            "spacing": "sm",
                                            "contents": [
                                                {
                                                    "type": "button",
                                                    "style": "primary",
                                                    "height": "sm",
                                                    "action": {
                                                        "type": "message",
                                                        "label": doc[0] + '\n',
                                                        "text": doc[0]
                                                    }
                                                },
                                                {
                                                    "type": "button",
                                                    "style": "primary",
                                                    "height": "sm",
                                                    "action": {
                                                        "type": "message",
                                                        "label": doc[1] + '\n',
                                                        "text": doc[1]
                                                    }
                                                },
                                                {
                                                    "type": "box",
                                                    "layout": "vertical",
                                                    "contents": [],
                                                    "margin": "sm"
                                                }
                                            ],
                                            "flex": 0
                                        }
                                    )
                                }
                            }
                            else {
                                var footer = (
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "spacing": "sm",
                                        "contents": [
                                            {
                                                "type": "button",
                                                "style": "primary",
                                                "height": "sm",
                                                "action": {
                                                    "type": "message",
                                                    "label": doc[0] + '\n',
                                                    "text": doc[0]
                                                }
                                            },
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [],
                                                "margin": "sm"
                                            }
                                        ],
                                        "flex": 0
                                    }
                                )
                            }
                        }
                        else {
                            var footer = (
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "box",
                                            "layout": "vertical",
                                            "contents": [],
                                            "margin": "sm"
                                        }
                                    ],
                                    "flex": 0
                                }
                            )
                        }
                    }
                    if (doc.length > 0) {
                        var body = {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "Sensor",
                                    "weight": "bold",
                                    "size": "xl"
                                }
                            ]
                        }
                    }
                    if (doc.length > 0) {
                        var header = {
                            "type": "flex",
                            "altText": "Flex Message",
                            "contents": {
                                "type": "bubble",
                                "hero": {
                                    "type": "image",
                                    "url": "https://cdn.shopify.com/s/files/1/0043/7154/6227/products/DHT22_P_f9dd93f5-d1d8-4e36-a2ba-8cef9b5eb60c_1200x1200.jpg?v=1634286203",
                                    "size": "full",
                                    "aspectRatio": "20:13",
                                    "aspectMode": "cover",
                                    "action": {
                                        "type": "uri",
                                        "uri": "http://linecorp.com/"
                                    }
                                },
                                body,
                                footer,
                            }
                        }
                    }
                    if (doc.length === 0) {
                        var header = {
                            "type": "text",
                            "text": "no information found.!!!"
                        }
                    }
                    // Message data, must be stringified
                    const dataString = JSON.stringify({
                        replyToken: req.body.events[0].replyToken,
                        messages: [
                            header
                        ]
                    })
                    // Request header
                    const headers = {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + TOKEN
                    }
                    // Options to pass into the request
                    const webhookOptions = {
                        "hostname": "api.line.me",
                        "path": "/v2/bot/message/reply",
                        "method": "POST",
                        "headers": headers,
                        "body": dataString
                    }
                    // Define request
                    const request = https.request(webhookOptions, (res) => {
                        res.on("data", (d) => {
                            process.stdout.write(d)
                        })
                    })
                    // Handle error
                    request.on("error", (err) => {
                        console.error(err)
                    })
                    // Send data
                    request.write(dataString)
                    request.end()
                }
                return
            })
        }
        if (user_id1) {
            User.findOne({ $and: [{ 'namesensor': user_message }, { 'idMicro': idSerial }] }, { '_id': 1, 'onoff1': 1, 'onoff2': 1 }).then(function (doc1) {
                _idMicro = doc1?._id
                if (doc1?.onoff1 == true) {
                    status = "On"
                    text = "Off"
                    color = "#0BCD55"
                    color1 = "#FF0000"
                    label = "false1"
                }
                else {
                    status = "Off"
                    text = "On"
                    color = "#FF0000"
                    color1 = "#0BCD55"
                    label = "true1"
                }
                if (doc1?.onoff2 == true) {
                    status1 = "On"
                    text1 = "Off"
                    color2 = "#0BCD55"
                    color3 = "#FF0000"
                    label1 = "false2"
                }
                else {
                    status1 = "Off"
                    text1 = "On"
                    color2 = "#FF0000"
                    color3 = "#0BCD55"
                    label1 = "true2"
                }
                User.findOne({ $and: [{ 'namesensor': user_message }, { 'idSerial': idSerial }] }, { '_id': 0, 'temperature': 1, 'humidity': 1, 'aqi': 1 }).sort(mysort).then(function (doc) {
                    if (doc?.temperature > 0) {
                        namesensor1 = req.body.events[0].message.text
                        var footer = (
                            {
                                "type": "box",
                                "layout": "vertical",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "box",
                                        "layout": "baseline",
                                        "contents": [
                                            {
                                                "type": "icon",
                                                "url": "https://cdn-icons-png.flaticon.com/512/1090/1090683.png",
                                                "size": "md"
                                            },
                                            {
                                                "type": "text",
                                                "text": " Temperature : " + doc?.temperature + "°C",
                                                "size": "md"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "box",
                                        "layout": "baseline",
                                        "contents": [
                                            {
                                                "type": "icon",
                                                "url": "https://png.pngtree.com/png-vector/20190219/ourlarge/pngtree-vector-humidity-icon-png-image_563949.jpg",
                                                "size": "md"
                                            },
                                            {
                                                "type": "text",
                                                "text": " Humidity : " + doc?.humidity + "%",
                                                "size": "md"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "box",
                                        "layout": "baseline",
                                        "contents": [
                                            {
                                                "type": "icon",
                                                "url": "https://media.istockphoto.com/id/1433126279/vector/abstract-cloud-pm-2-5-for-concept-design-cloud-icon-vector-illustration-stock-image.jpg?b=1&s=170667a&w=0&k=20&c=HddytKGZavZWOfgvdSKw_hNUGnw8XYWrpDtOInNrtt4=",
                                                "size": "md"
                                            },
                                            {
                                                "type": "text",
                                                "text": " PM2.5 : " + doc?.aqi + "AQI",
                                                "size": "md"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "separator",
                                        "margin": "md"
                                    },
                                    {
                                        "type": "text",
                                        "text": "Relay 1 ",
                                        "color": "#000000",
                                        "size": "md",
                                        "weight": "bold",
                                        "align": "center"
                                    },
                                    {
                                        "type": "separator",
                                        "margin": "md"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [],
                                        "margin": "sm"
                                    },
                                    {
                                        "type": "text",
                                        "text": "Status : " + status,
                                        "color": color,
                                        "size": "md",
                                        "weight": "bold",
                                        "align": "center"
                                    },
                                    {
                                        "type": "button",
                                        "color": color1,
                                        "style": "primary",
                                        "margin": "md",
                                        "height": "sm",
                                        "action": {
                                            "type": "message",
                                            "label": text,
                                            "text": label
                                        },
                                    },
                                    {
                                        "type": "separator",
                                        "margin": "md"
                                    },
                                    {
                                        "type": "text",
                                        "text": "Relay 2 ",
                                        "color": "#000000",
                                        "size": "md",
                                        "weight": "bold",
                                        "align": "center"
                                    },
                                    {
                                        "type": "separator",
                                        "margin": "md"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [],
                                        "margin": "sm"
                                    },
                                    {
                                        "type": "text",
                                        "text": "Status : " + status1,
                                        "color": color2,
                                        "size": "md",
                                        "weight": "bold",
                                        "align": "center"
                                    },
                                    {
                                        "type": "button",
                                        "color": color3,
                                        "style": "primary",
                                        "margin": "md",
                                        "height": "sm",
                                        "action": {
                                            "type": "message",
                                            "label": text1,
                                            "text": label1
                                        },
                                    }
                                ],
                                "flex": 0
                            }
                        )
                        var body = {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "Weather",
                                    "weight": "bold",
                                    "size": "xl"
                                }
                            ]
                        }
                        var header = {
                            "type": "flex",
                            "altText": "Flex Message",
                            "contents": {
                                "type": "bubble",
                                "hero": {
                                    "type": "image",
                                    "url": "https://img.winnews.tv/files/site/e83631d3ff566f089b23641f0aac5082.jpg",
                                    "size": "full",
                                    "aspectRatio": "20:13",
                                    "aspectMode": "cover",
                                    "action": {
                                        "type": "uri",
                                        "uri": "http://linecorp.com/"
                                    }
                                },
                                body,
                                footer,
                            }
                        }
                        // Message data, must be stringified
                        const dataString = JSON.stringify({
                            replyToken: req.body.events[0].replyToken,
                            messages: [
                                header
                            ]
                        })
                        // Request header
                        const headers = {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + TOKEN
                        }
                        // Options to pass into the request
                        const webhookOptions = {
                            "hostname": "api.line.me",
                            "path": "/v2/bot/message/reply",
                            "method": "POST",
                            "headers": headers,
                            "body": dataString
                        }
                        // Define request
                        const request = https.request(webhookOptions, (res) => {
                            res.on("data", (d) => {
                                process.stdout.write(d)
                            })
                        })
                        // Handle error
                        request.on("error", (err) => {
                            console.error(err)
                        })
                        // Send data
                        request.write(dataString)
                        request.end()
                    }
                })
            })
        }
    }
})

client.on('message', (topic, message) => {
    console.log(`Received message on ${topic}: ${message.toString()}`);
});

app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Server Started At Port 1111");
    }
});