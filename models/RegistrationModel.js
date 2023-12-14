const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    middleName: String,
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    dob: {
        type: Date,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    interests: {
        type: [String],
    },
    profilePicture: String,
});

const RegistrationModel = mongoose.model('Registration', registrationSchema);

module.exports = RegistrationModel;
