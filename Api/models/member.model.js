const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const memberSchema = new mongoose.Schema({
    id: String,
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (email) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    email
                );
            },
            message: "Email format incorrect"
        }
    },
    login: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    creationDate: {
        type: String,
        required: true
    },
    deletedDate: String,
    flags: { isDeleted: Boolean, isRegisterComplete: Boolean },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

memberSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
};

memberSchema.methods.validPassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
    return this.hash === hash;
};

memberSchema.methods.generateJwt = function () {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1); // expiration du jwt après 1 jour.
    return jwt.sign(
        {
            // payload
            _id: this._id,
            email: this.email,
            permissions: ["member"],
            exp: parseInt(expiry.getTime() / 1000, 10)
        },
        process.env.JWT_SECRET
    );
};

module.exports = mongoose.model("members", memberSchema);
