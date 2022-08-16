const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const dbUrl = 'mongodb://localhost:27017/UserDB'
mongoose.connect(dbUrl, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err));

let userSchema = new mongoose.Schema({
    username:String,
    password:String,
    firstname:String,
    lastname:String,
    email:String,
    user_id:String,
    namemicrocontroller:String,
    namesensorone:String,
    namesensortwo:String
})

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model('users', userSchema)

module.exports = User

module.exports.saveUser = ((model, data) => {
    model.save(data)
})