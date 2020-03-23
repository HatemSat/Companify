/* Imports et initialisation */
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/config')
const expertModel = require('../models/expert.model');


// Restrictions d'accès admin/membres/experts
const guard = require('express-jwt-permissions')({
    requestProperty: 'payload',
    permissionsProperty: 'permissions'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* GET Liste des experts */
router.get('/', guard.check(['admin']), (req, res, next) => {
    console.log(req.payload);

    // Find all properties except hash and salt
    expertModel.find({}, '-hash -salt', (err, experts) => {
        if (err || !experts.length) {
            res.json({ status: "error", message: "No experts in database" });
        } else {
            res.json(experts);
        }
    });
});

/* GET Détail d'un expert */
router.get('/:id', guard.check([
    ['admin'],
    ['expert']
]), (req, res, next) => {
    expertModel.findById(req.params.id, '-hash -salt', (err, expert) => {
        if (err) {
            res.json({ status: "error", message: "Expert not found" });
        } else {
            res.json(expert);
        }
    });
});

/* POST Création d'un expert */
router.post('/', guard.check(['admin']), (req, res, next) => {
    const newExpert = new expertModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        email: req.body.email,
        assignedMembers: undefined,
        flags: { isDeleted: false },
        creationDate: nowDateTimeFormatted()
    });
    // TODO implémenter la génération auto du mot de passe et l'envoi du mail de confirmation
    const password = "passe";
    newExpert.setPassword(password);

    newExpert.save((err, expert) => {
        if (err) {
            res.json({ status: "error", message: "expert not created" });
            console.error(err);
        } else {
            res.json({ status: "success", message: "expert created", expert: expert });
        }
    });
});


/* PUT Màj d'un expert */
router.put('/:id', guard.check(['admin'], ['expert']), (req, res, next) => {
    console.log(req.body.assignedMembers);

    expertModel.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        email: req.body.email,
        assignedMembers: req.body.assignedMembers,
    }, { new: true, omitUndefined: true }, (err, updatedExpert) => {
        if (err) {
            res.json({ status: "error", message: "Expert not updated", error: err });
        } else {
            res.json(updatedExpert);
        }
    });

});

/* DELETE Suppression d'un expert - Flag */
router.delete('/:id', guard.check(['admin']), (req, res, next) => {

    expertModel.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
        deletedDate: nowDateTimeFormatted()
    }, { new: true, omitUndefined: true }, (err, deletedExpert) => {
        if (err) {
            res.json({ status: "error", message: "Expert not deleted", error: err });
        } else {
            res.json(deletedExpert);
        }
    });
});



function nowDateTimeFormatted() {

    var date3 = new Date().toLocaleString('fr-FR', { hour12: false, });
    var tab = date3.split(' ');
    var dateTab = tab[0].split('-');
    var timeTab = tab[1].split(':');
    timeTab.pop();
    dateTab.reverse();
    var d = dateTab.join('/');
    var t = timeTab.join(':');

    return d + ' ' + t;

}

module.exports = router;