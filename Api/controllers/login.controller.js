/* Imports et initialisation */
const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('../config/config')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO POST login expert.

/* POST Login d'un membre avec authentification passport */
router.post('/member', (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.json({ status: "error", message: "Tout les champs sont requis" });
    }
    passport.authenticate('member', (err, member, info) => {
        if (err) {
            console.error(err);
            return res.status(404).json({ message: "error" });
        }
        if (member) {
            const token = member.generateJwt();
            res.status(200).json({ token: token, flags: member.flags });
        } else {
            res.status(401).json(info);
        }
    })(req, res);
})

/* POST Login d'un admin avec authentification passport */
router.post('/admin', (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.json({ status: "error", message: "Tout les champs sont requis" });
    }
    passport.authenticate('admin', (err, admin, info) => {
        if (err) {
            console.error(err);
            return res.status(404).json({ message: "error" });
        }
        if (admin) {
            const token = admin.generateJwt();
            res.status(200).json({ token });
        } else {
            res.status(401).json(info);
        }
    })(req, res);
})

module.exports = router;