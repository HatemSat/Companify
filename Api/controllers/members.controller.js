/* Imports et initialisation */
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/config')
const memberModel = require('../models/member.model');
const companyModel = require('../models/company.model');
mongoose.set('useFindAndModify', false);


// Restrictions d'accès admin/membres/experts.
const guard = require('express-jwt-permissions')({
    requestProperty: 'payload',
    permissionsProperty: 'permissions'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* GET Liste des membres w/Cache */
router.get('/', guard.check(['admin']), (req, res, next) => {
    // Get all properties except hash and salt

    memberModel.find({}, '-hash -salt')
        .cache(60)
        .exec((err, members) => {
            if (err || !members.length) {
                res.status(204).json({ status: "error", message: "No members in database" });
            } else {
                res.json(members);
            }
        })
});

/* GET Détails d'un membre */
router.get('/:id', guard.check([
    ['admin'],
    ['member'],
    ['expert']
]), (req, res, next) => {
    memberModel.findById(req.params.id, '-salt -hash', (err, member) => {
        if (err) {
            res.json({ status: "error", message: "Member not found" });
        } else {
            res.json(member);
        }
    });
});

/* POST Création d'un membre */
router.post('/', guard.check(['admin']), (req, res, next) => {
    const newMember = new memberModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        email: req.body.email,
        post: req.body.post,
        team: req.body.team,
        company: req.body.company,
        flags: { isDeleted: false, isRegisterComplete: false },
        creationDate: nowDateTimeFormatted()
    });

    // TODO implémenter la génération auto du mot de passe et l'envoi du mail
    const password = "passe";
    newMember.setPassword(password)
    
    // TODO Refactor
    companyModel.findOne({ name: req.body.company }, (err, company) => {
        if (err) {
            res.json({ status: "error", message: "Error finding company associated with this user" });
        } else {
            if (company.usedLicenses >= company.totalLicenses) {
                res.status(404).json({ status: "error", message: "The company is full" });
                return

            } else {
                newMember.save((err, member) => {
                    if (err) {
                        res.json({ status: "error", message: "member not created" })
                        console.error(err);
                    } else {
                        companyModel.findOneAndUpdate({ name: req.body.company }, { "$inc": { usedLicenses: 1 }, "$push": { members: { "memberId": member._id, "lastName": member.lastName, "firstName": member.firstName } } }, { new: true, omitUndefined: true },
                            ((err, company) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    if (company.usedLicenses >= company.totalLicenses) {
                                        companyModel.updateOne({ name: req.body.company }, { flags: { isFull: true } })
                                        // res.json({ status: "success", message: "member created", member: member });
                                    }
                                    // else {
                                    res.json({ status: "success", message: "member created", member: member });
                                    // }
                                }
                            })).catch(err => console.log(err))
                    }
                }).catch(err => console.log(err));
            }
        }
    });




    //memberId: String, lastName: String, firstName: String }
});

/* PUT Màj d'un membre */
router.put('/:id', guard.check(['admin'], ['member']), (req, res, next) => {
    memberModel.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        email: req.body.email,
        post: req.body.post,
        team: req.body.team,
        company: req.body.company,
    }, { new: true, omitUndefined: true }, (err, updatedMember) => {
        if (err) {
            res.json({ status: "error", message: "Member not updated", error: err });
        } else {
            res.json(updatedMember);
        }
    });
});

/* DELETE Suppression d'un membre - Flag */
router.delete('/:id', guard.check(['admin']), (req, res, next) => {
    memberModel.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
        deletedDate: nowDateTimeFormatted()
    }, { new: true, omitUndefined: true }, (err, deletedMember) => {
        if (err) {
            res.json({ status: "error", message: "Member not deleted", error: err });
        } else {
            res.json(deletedMember);
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