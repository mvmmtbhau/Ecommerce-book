const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const Schema = mongoose.Schema;

const schema = new Schema({
    products: [],
    total: {
        type: Number,
    },
    status: {
        type: Number,
        default: 0
    },
    shippingAddress: {
        type: String,
        required: true
    },
    userDel: {
        type: Boolean,
        default: false
    },
    userRate: {
        type: Boolean,
        default: false,
    },
    adminDel: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model('Order', schema);