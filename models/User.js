const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Crete Schema
const UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now

    }
})

module.exports = mongoose.model("users", UserSchema);