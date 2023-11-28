const { User } = require('../models');

class UserService {
    // async getAll() {
    //     return await Category.find({});
    // }

    async createNew(data) {
        return await new User(data).save();
    }

    async findOne(filter, preject = {}) {
        return await User.findOne(filter, preject).populate('province').populate('district').populate('ward');
    }

    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, { password: 0 }, { $new: true }).populate('province').populate('district').populate('ward')
    }

    async find(filter) {
        return await User.find(filter);
    }

    // async delete(id) {
    //     return await Category.findByIdAndDelete(id);
    // }
}

module.exports = new UserService();