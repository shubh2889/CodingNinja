const mongoose = require('mongoose');

const likeShema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId
    },
    // this defines the objectid of the liked object
    likeable: {
        type: mongoose.Schema.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    // this foeld is used for the defining the type of the liked object since this is a dynamic reference
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    }
}, {
    timestamps: true
});

const Like = mongoose.model('Like', likeShema);

module.exports = Like;