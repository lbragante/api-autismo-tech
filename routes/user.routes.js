const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/token.middleware');
const User = require('../models/User.model');


// Find all users
router.get('/all', verifyToken, async (req, res) => {
    try {
        const user = await User.find({ active: true }).sort({ createdAt: -1 });
        res.send(user);
    } catch (error) {
        res.status(500).send({
            message: error.message || 'Some error occurred while retrieving users'
        });
    }
});


// Find one user
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId, req.body);
        res.send(user);
    } catch (error) {
        res.status(500).send({
            message: error.message || 'Some error occurred while retrieving user with id ' + req.params.userId
        });
    }
});


// Update User
router.put('/:userId', verifyToken, async (req, res) => {

    // Verify CPF
    const cpfExist = await User.findOne({ cpf: req.body.cpf });
    if (cpfExist) {
        return res.status(400).send({
            message: 'CPF already registered'
        });
    }

    try {
        // runValidators é para ativar a validação no Update (Mongoose 4+)
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true });
        res.send(user);
    } catch (error) {
        return res.status(500).send({
            message: error.message || 'Error updating user with id ' + req.params.userId
        });
    }
});


// Delete User
router.delete('/:userId', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.userId, req.body);
        res.send({
            message: 'User deleted successfully'
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Could not delete note with id ' + req.params.userId
        });
    }
});


module.exports = router;