// require these modules for our user model
let mongoose = require("mongoose");
let Schema = mongoose.Schema; //alias
let passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new Schema({
    username: {
        type: String,
        default: '',
        trim: true,
        required: 'username is required'
    },
    /*password: {
         type: String,
        default: '',
        trim: true,
        required: 'password is required'
    },*/
    email: {
         type: String,
        default: '',
        trim: true,
        required: 'email is required'
    },
    displayName: {
         type: String,
        default: '',
        trim: true,
        required: 'Display Name is required'
    },
    created: {
         type: Date,
         default: Date.now
    },
    updated: {
         type: Date,
         default: Date.now
    }
},
{
    collection: "users"
});

//can have many other options
let options = ({missingPassportError: "Wrong password"});

userSchema.plugin(passportLocalMongoose, options);

exports.User = mongoose.model('User', userSchema);