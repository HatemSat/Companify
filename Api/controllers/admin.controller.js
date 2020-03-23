/* Imports et initialisation */
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/config')
const adminModel = require('../models/admin.model');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* POST Création d'un admin */
router.post('/', (req, res, next) => {
    const newAdmin = new adminModel({
        email: req.body.email
    });
    // TODO génération mot de passe / envoi mail
    const password = "admin";
    newAdmin.setPassword(password);
    newAdmin.save((err, admin) => {
        if (err) {
            res.json({ status: "error", message: "admin not created" });
        } else {
            res.json({ status: "success", message: "admin created", admin: admin });
        }
    });
});

module.exports = router;