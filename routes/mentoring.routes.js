const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/token.middleware');
const { mentoringValidation } = require('../config/validations.config');
const Mentoring = require('../models/Mentoring.model');

// Create a new mentoring
router.post('/create', verifyToken, async (req, res) => {

    const { error } = mentoringValidation(req.body);

    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        });
    }

    const mentoringSave = new Mentoring(req.body);

    try {
        const mentoring = await mentoringSave.save();
        res.send(mentoring);
    } catch (error) {
        res.status(500).send({
            message: error.message ||  'Some error occurred while creating the Mentoring'
        });
    }

});


// Find all mentorings
router.get('/all', verifyToken, async (req, res) => {
    try {
        const mentoring = await Mentoring.find({ active: true }).sort({ createdAt: -1 });
        res.send(mentoring);
    } catch (error) {
        res.status(500).send({
            message: error.message ||  'Some error occurred while retrieving mentoring'
        });
    }
});


// Find one mentoring
router.get('/:mentoringId', verifyToken, async (req, res) => {
    try {
        const mentoring = await Mentoring.findById(req.params.mentoringId, req.body);
        res.send(mentoring);
    } catch (error) {
        res.status(500).send({
            message: 'Some error occurred while retrieving mentoring with id ' + req.params.mentoringId
        });
    }
});


// Update Mentoring
router.put('/:mentoringId', verifyToken, async (req, res) => {
    try {
        const mentoring = await Mentoring.findByIdAndUpdate(req.params.mentoringId, req.body, { new: true, runValidators: true });
        res.send(mentoring);
    } catch (error) {
        return res.status(500).send({
            message: error.message ||  'Error updating mentoring with id ' + req.params.mentoringId
        });
    }
});


// Delete Mentoring
router.delete('/:mentoringId', verifyToken, async (req, res) => {
    try {
        await Mentoring.findByIdAndRemove(req.params.mentoringId, req.body);
        res.send({
            message: 'Mentoring deleted successfully'
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Could not delete note with id ' + req.params.mentoringId
        });
    }
});


module.exports = router;