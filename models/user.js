const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    verified: {type: Boolean, default: false},
    code: {type: String}
})

const User = mongoose.model('User', UserSchema);
module.exports = User;