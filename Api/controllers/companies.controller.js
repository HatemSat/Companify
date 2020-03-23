/* Imports et initialisation */
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');

const config = require('../config/config')
const companyModel = require('../models/company.model');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TO REMOVE
// Restrictions d'accès admin/membres.
// const guard = require('express-jwt-permissions')({
//     requestProperty: 'payload',
//     permissionsProperty: 'permissions'
// });

/* GET Liste des entreprises */
router.get('/', (req, res, next) => {

    companyModel.find({})
        .cache(60)
        .exec((err, company) => {
            if (err || !company.length) {
                res.status(204).json({ status: "error", message: "No companies in database" });
            } else
                res.json(company);
        });


});


/* GET Détails d'une entreprise par id */
router.get('/:id', (req, res, next) => {
    companyModel.findById(req.params.id, (err, company) => {
        if (err) {
            res.json({ status: "error", message: "Company not found" });
        } else {
            console.log(company);

            res.json(company);
        }
    });
});



/* POST Création d'une entreprise */
router.post('/', (req, res, next) => {
    const newCompany = new companyModel({
        name: req.body.name,
        address: req.body.address,
        siret: req.body.siret,
        activity: req.body.activity,
        teams: req.body.teams,
        totalLicenses: req.body.totalLicenses,
        usedLicenses: 0,
        contacts: req.body.contacts,
        creationDate: new Date().toLocaleString('fr-FR', { hour12: false })
    });

    newCompany.save((err, company) => {
        if (err) {
            res.status(500).json({ status: "error", message: "company not created" });
            console.error(err);
        } else
            res.json({ status: "success", message: "company created", company: company._id });
    });
});


/* PUT Màj d'une entreprise */
router.put('/:id', (req, res, next) => {
    companyModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        address: req.body.address,
        siret: req.body.siret,
        activity: req.body.activity,
        totalLicenses: req.body.totalLicenses,
        usedLicenses: req.body.usedLicenses,
        teams: req.body.teams,
        contacts: req.body.contacts,
        creationDate: undefined
    }, { new: true, omitUndefined: true }, (err, updatedCompany) => {
        if (err) {
            res.json({ status: "error", message: "Company not updated", error: err });
        } else {
            res.json(updatedCompany);
        }
    });
});


module.exports = router;