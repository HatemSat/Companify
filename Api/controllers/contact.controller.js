/* Imports et initialisation */
const express = require('express');
const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.post('/', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;

    //TODO Sending Email

    res.json({ message: 'Message envoyé' })
})



module.exports = router;