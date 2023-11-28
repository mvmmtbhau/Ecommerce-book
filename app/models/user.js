const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const Schema = mongoose.Schema;

const schema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    id: String,
    password: {
        type: String,
        required: true
    },
    province: {
        name: String,
        code: Number
    },
    district: {
        name: String,
        code: Number
    },
    ward: {
        name: String,
        code: Number
    },
    address: String,
    typeLogin: {
        type: String,
        default: 'local'
    },
    role: {
        type: String,
        default: 'user',
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', schema);