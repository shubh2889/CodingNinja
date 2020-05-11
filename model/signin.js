const mongoose = require('mongoose');

const signInSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const SignIn = mongoose.model('SignIn', signInSchema);

module.exports = SignIn;