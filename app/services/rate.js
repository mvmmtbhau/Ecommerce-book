const { Rate } = require('../models');

class RateService {
    async createNew(data) {
        return await new Rate(data).save();
    }

    async findLimit(filter, numLimit, skipNum, sort) {
        return await Rate.find(filter).limit(numLimit).skip(skipNum).sort(sort).populate('owner', '-password');
    }

    async findOne(filter) {
        return await Rate.findOne(filter).populate('owner', '-password');
    }

    async find(filter) {
        return await Rate.find(filter).populate('owner', '-password');
    }

    async updateById(id, data) {
        return await Rate.findByIdAndUpdate(id, data).populate('owner', '-password');
    }

    async deleteById(id) {
        return await Rate.findByIdAndDelete(id).populate('owner', '-password');
    }
}

module.exports = new RateService();