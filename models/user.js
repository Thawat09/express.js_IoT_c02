const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const dbUrl = 'mongodb://127.0.0.1:3306/node-red-mqtt'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err));

let userSchema = new mongoose.Schema({
    username: String,
    idline: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    user_id: String,
    serialnumber: String,
    namemicrocontroller: String,
    useridadmin: String,
    namesensor: String,
    sensor: String,
    sensorPin: String,
    idMicro: String,
    idSerial: String,
    date: Date,
    temperature: String,
    humidity: String,
    aqi: String,
    current: String,
    frequency: String,
    autoOn: String,
    autoOff: String,
    onoff1: Boolean,
    onoff2: Boolean
})

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model('test2', userSchema)

module.exports = User

module.exports.saveUser = ((model, data) => {
    model.save(data)
})