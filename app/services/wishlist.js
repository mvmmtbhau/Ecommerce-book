const { Wishlist } = require('../models');

class WishlistService {
    // async getAll() {
    //     return await Category.find({});
    // }

    async createNew(data) {
        return await new Wishlist(data).save();
    }

    async findLimit(filter, numLimit, skipNum) {
        return await Wishlist.find(filter).limit(numLimit).skip(skipNum).populate('items');
    }

    async findOne(filter) {
        return await Wishlist.findOne(filter).populate('items');
    }

    async update(id, data){
        return await Wishlist.findByIdAndUpdate(id, data, {new: true}).populate('items')
    }

    async findAndUpdate(filter, data) {
        return await Wishlist.findOneAndUpdate(filter, data, {new: true}).populate('items');
    }

    async find(filter){
        return await Wishlist.find(filter).populate('items');
    }

    // async delete(id) {
    //     return await Category.findByIdAndDelete(id);
    // }
}

module.exports = new WishlistService();