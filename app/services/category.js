const { Category } = require('../models');

class CategoryService {
    async getAll() {
        return await Category.find({});
    }

    async createNew(data) {
        return await new Category(data).save();
    }
}

module.exports = new CategoryService();