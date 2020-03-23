const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
    id: String,
    email: String,
    hash: String,
    salt: String
});

adminSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

adminSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

adminSchema.methods.generateJwt = function () {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1); // expiration du jwt après 1 jour.
    return jwt.sign({ //payload
        _id: this._id,
        email: this.email,
        permissions: ['admin'],
        exp: parseInt(expiry.getTime() / 1000, 10)
    }, process.env.JWT_SECRET);
}

module.exports = mongoose.model('admins', adminSchema);
