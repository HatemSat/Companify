const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    id: String,
    name: String,
    address: String,
    siret: String,
    activity: String,
    teams: [{ name: String }],
    members: [{ memberId: String, lastName: String, firstName: String }],
    flags: { isFull: Boolean },
    totalLicenses: Number,
    usedLicenses: Number,
    contacts: [{ firstName: String, lastName: String, role: String, emails: [{ email: String }], phoneNumbers: [{ phoneNumber: String }], isMainContact: Boolean }],
    creationDate: String
});
module.exports = mongoose.model('companies', companySchema);