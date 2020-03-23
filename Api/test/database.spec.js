process.env.NODE_ENV = 'test'
const members = require("..//models/member.model");
const request = require("supertest");
const expect = require("chai").expect;
const server = require("../server");


describe('GET Ressources', () => {

    describe("Get api/members", () => {
        it("should return an array of members w/ code 200 or code 204 if no member", (done) => {
            request(server)
                .get("/api/members")
                .set('Authorization', `Bearer ${process.env.SUPER_TOKEN}`)
                .then((res) => {
                    expect(res.status).to.satisfy((stat) => stat === 200 || stat === 204)
                    done()
                })
                .catch(err => done(err))
        });
    });



    describe("Get api/experts", () => {
        it("should return an array of experts w/ code 200 or code 204 if no expert", (done) => {
            request(server)
                .get("/api/companies")
                .set('Authorization', `Bearer ${process.env.SUPER_TOKEN}`)
                .then((res) => {
                    expect(res.status).to.satisfy((stat) => stat === 200 || stat === 204)
                    done()
                })
                .catch(err => done(err))
        });
    });

    describe("Get api/companies", () => {
        it("should return an array of companies w/ code 200 or code 204 if no company", (done) => {
            request(server)
                .get("/api/companies")
                .set('Authorization', `Bearer ${process.env.SUPER_TOKEN}`)
                .then((res) => {
                    expect(res.status).to.satisfy((stat) => stat === 200 || stat === 204)
                    done()
                })
                .catch(err => done(err))
        });
    });


})

describe('POST Ressources', () => {

    describe("Post api/companies", () => {
        it("should return the company created", (done) => {

            let company = {
                "name": "EDF",
                "address": "7677 Sunbrook Center",
                "siret": "63-999-8936",
                "activity": "Energie",
                "teams": [
                    { "name": "HelpDesk" },
                    { "name": "Board" },
                    { "name": "IT" },
                    { "name": "HelpDesk" },
                    { "name": "HR" }
                ],
                "totalLicenses": 50,
                "contacts": [{
                        "firstName": "Suzanne",
                        "lastName": "Wolfendell",
                        "role": "Health Coach II",
                        "emails": [
                            { "email": "cbrooker0@imgur.com" },
                            { "email": "pbee1@ovh.net" }
                        ],
                        "phoneNumbers": [
                            { "phoneNumber": "+63 636 370 6833" }
                        ],
                        "isMainContact": false
                    },
                    {
                        "firstName": "Doloritas",
                        "lastName": "Durber",
                        "role": "VP Product Management",
                        "emails": [{ "email": "ahabeshaw0@auda.org.au" },
                            { "email": "gsictornes1@techcrunch.com" },
                            { "email": "cgillbanks2@redcross.org" }
                        ],
                        "phoneNumbers": [{ "phoneNumber": "+62 545 777 0647" },
                            { "phoneNumber": "+86 190 569 0742" },
                            { "phoneNumber": "+380 723 293 1022" }
                        ],
                        "isMainContact": false
                    },
                    {
                        "firstName": "George",
                        "lastName": "Binnall",
                        "role": "Information Systems Manager",
                        "emails": [{ "email": "rfritche0@princeton.edu" }],
                        "phoneNumbers": [{ "phoneNumber": "+359 732 960 9761" }],
                        "isMainContact": false
                    }
                ],
            }

            request(server)
                .post("/api/companies")
                .set('Authorization', `Bearer ${process.env.SUPER_TOKEN}`)
                .set('Accept', 'application/json')
                .send(company)
                .then((res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body).have.property('status', 'success')
                    expect(res.body).have.property('message', 'company created')
                    done()
                })
                .catch(err => done(err))
        });
    });

    describe("Post api/member", () => {
        it("should return the member created", (done) => {
            let company = {}
            let member = {
                "firstName": "Blue",
                "lastName": "coco",
                "gender": "M",
                "birthDate": "21/01/1975",
                "email": "black@orange.com",
                "post": "Dev",
                "team": "IBM",
                "company": "EDF"
            }
            request(server)
                .post("/api/members")
                .set('Authorization', `Bearer ${process.env.SUPER_TOKEN}`)
                .set('Accept', 'application/json')
                .send(member)
                .then((res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body).have.property('status', 'success')
                    expect(res.body).have.property('message', 'member created')
                    done()
                })
                .catch(err => done(err))
        });
    });

    describe("Post api/admin", () => {
        it("should return the admin created", (done) => {
            let admin = {
                "email": "blue@cake.com"
            }
            request(server)
                .post("/api/admin")
                .set('Authorization', `Bearer ${process.env.SUPER_TOKEN}`)
                .set('Accept', 'application/json')
                .send(admin)
                .then((res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body).have.property('status', 'success')
                    expect(res.body).have.property('message', 'admin created')
                    done()
                })
                .catch(err => done(err))
        });
    });


    describe("Post api/expert", () => {
        it("should return the expert created", (done) => {
            let expert = {
                firstName: "John",
                lastName: "Fritz",
                gender: "M",
                birthDate: "02/10/1987",
                email: "john@fritz.com"
            }
            request(server)
                .post("/api/experts")
                .set('Authorization', `Bearer ${process.env.SUPER_TOKEN}`)
                .set('Accept', 'application/json')
                .send(expert)
                .then((res) => {
                    expect(res.status).to.equal(200)
                        // expect(res.status).to.equal(300)
                    expect(res.body).have.property('status', 'success')
                    expect(res.body).have.property('message', 'expert created')
                    done()
                })
                .catch(err => done(err))
        });
    });

})