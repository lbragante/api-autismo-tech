const mongoose = require('mongoose');

const MentoringSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Mentoring', MentoringSchema);