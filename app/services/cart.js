const { Cart } = require('../models');

class CartService {

    async createNew(data) {
        return (await new Cart(data).save()).populate('products.product');
    }

    async findOne(filter) {
        return await Cart.findOne(filter).populate('products.product');
    }

    async update(filter, data){
        return await Cart.findOneAndUpdate(filter, data, {new: true}).populate('products.product');
    }

    async updateById(id, data) {
        return await Cart.findByIdAndUpdate(id, data, {new: true}).populate('products.product');
    }

    async find(filter){
        return await Cart.find(filter).populate('products.product');
    }

    // async delete(id) {
    //     return await Category.findByIdAndDelete(id);
    // }
}

module.exports = new CartService();