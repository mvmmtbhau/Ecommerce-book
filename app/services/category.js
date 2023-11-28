const { Category } = require('../models');

class CategoryService {
    async getAll() {
        return await Category.find({});
    }

    async createNew(data) {
        return await new Category(data).save();
    }

    async update(id, data){
        return await Category.findByIdAndUpdate(id, data, {new: true});
    }

    async find(filter){
        return await Category.find(filter);
    }

    async findOne(filter){
        return await Category.findOne(filter);
    }

    async delete(id) {
        return await Category.findByIdAndDelete(id);
    }
}

module.exports = new CategoryService();