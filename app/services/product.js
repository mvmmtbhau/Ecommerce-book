const { Product } = require('../models');

class ProductService {
    async getAll() {
        return await Product.find({});
    }

    async createNew(data) {
        return await new Product(data).save();
    }

    async update(id, data){
        return await Product.findByIdAndUpdate(id, data,{new: true}).populate('category')
    }

    async find(filter){
        return await Product.find(filter).populate('category');
    }

    async search(filter, limitValue = null, sort = {}) {
        let query = Product.find(filter).sort(sort).populate('category');

        if(limitValue) {
            query.limit(limitValue)
        }

        return await query;
    } 

    async findLimit(filter, numLimit, skipNum, sort) {
        return await Product.find(filter).limit(numLimit).skip(skipNum).sort(sort).populate('category');
    }

    async findOne(filter){
        return await Product.findOne(filter).populate('category');
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = new ProductService();