const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const Schema = mongoose.Schema;

const schema = new Schema({
    products: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
        },
        quantity: Number,
        _id: false,
    }],
    // quantitys: [],
    total: {
        type: Number,
        default: 0,
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

module.exports = mongoose.model('Cart', schema);