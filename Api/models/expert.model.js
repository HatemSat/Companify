const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const expertSchema = new mongoose.Schema({
    id: String,
    email: {
        type: String
    },
    firstName: String,
    lastName: String,
    birthDate: String,
    gender: String,
    assignedMembers: [{ memberId: String, lastName: String, firstName: String }],
    creationDate: String,
    flags: { isDeleted: Boolean },
    hash: String,
    salt: String
});

expertSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

expertSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

expertSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1); // expiration du jwt après 1 jours.
    return jwt.sign({ // payload
        _id: this._id,
        email: this.email,
        permissions: ['expert'],
        exp: parseInt(expiry.getTime() / 1000, 10)
    }, process.env.JWT_SECRET);
}

module.exports = mongoose.model('experts', expertSchema);