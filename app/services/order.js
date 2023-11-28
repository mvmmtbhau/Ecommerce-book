const { Order } = require('../models');

class OrderService {
    async createNew(data) {
        return await new Order(data).save();
    }

    async findLimit(filter, numLimit, skipNum, sort) {
        return await Order.find(filter).limit(numLimit).skip(skipNum).sort(sort).populate('owner', '-password');
    }

    async findOne(filter) {
        return await Order.findOne(filter).populate('owner', '-password');
    }

    async find(filter) {
        return await Order.find(filter).populate('owner', '-password');
    }

    async updateById(id, data) {
        return await Order.findByIdAndUpdate(id, data).populate('owner', '-password');
    }

    async deleteById(id) {
        return await Order.findByIdAndDelete(id).populate('owner', '-password');
    }
}

module.exports = new OrderService();