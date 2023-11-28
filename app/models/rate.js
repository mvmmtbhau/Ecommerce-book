const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const Schema = mongoose.Schema;

const schema = new Schema({
    textRate: {
        type: String,
        default: ''
    },
    showName: {
        type: String,
    },
    star: {
        type: Number
    },
    ofProduct: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Rate', schema);