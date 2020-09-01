const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { registerValidation, loginValidation } = require('../config/validations.config');
const User = require('../models/User.model');

// Register a new user
router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        });
    }

    // Verify CPF
    const cpfExist = await User.findOne({ cpf: req.body.cpf });
    if (cpfExist) {
        return res.status(400).send({
            message: 'CPF already registered'
        });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const userSave = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        cpf: req.body.cpf,
        email: req.body.email,
        password: hashPassword,
        typeUser: req.body.typeUser
    });

    try {
        const user = await userSave.save();
        user.password = undefined;
        res.send(user);
    } catch (error) {
        res.status(500).send({
            message: error.message ||  'Some error occurred while creating the User'
        });
    }

});


// Login
router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        });
    }

    // Verify CPF
    const user = await User.findOne({ cpf: req.body.cpf }).select('+password');

    if (!user) {
        return res.status(400).send({
            message: 'CPF or password is invalid'
        });
    }

    // Verify password
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.status(400).send({
            message: 'CPF or password is invalid'
        });
    }

    user.password = undefined;

    // Token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: 86400 // 24 hours
    });
    res.header(token).send({
        user: user,
        token: token
    });
});


// Logout
router.get('/logout', async (req, res) => {
    res.status(200).send({
        token: null
    });
    console.log('Logout');
});


module.exports = router;