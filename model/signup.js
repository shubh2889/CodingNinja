const mongoose = require('mongoose');

const signUpSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const SignUp = mongoose.model('SignUp', signUpSchema);

module.exports = SignUp;