var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
// console.log(
//     '\n:::::::::::::::::::::::::::::::::::::: env var :::::::::::::::::::::::::::::::::::::::::::::::::::',
//     '\n::process.env.IT_IS_A_SECRET::'+ process.env.IT_IS_A_SECRET,
//     '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
// )
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
});
userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};
userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};
userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
console.log(
    '\n:::::::::::::::::::::::::::::::::::::: expiry :::::::::::::::::::::::::::::::::::::::::::::::::::',
    '\n::expiry::'+ expiry,
    '\n::expiry.getDate()::'+ expiry.getDate(),
    '\n::expiry.setDate(expiry.getDate() + 7)::'+ expiry.setDate(expiry.getDate() + 7),
    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
)
    return jwt.sign({
            _id: this._id,
            email: this.email,
            name: this.name,
            exp: parseInt(expiry.getTime() / 1000),
        },
        process.env.IT_IS_A_SECRET
    );
};
mongoose.model('User', userSchema);