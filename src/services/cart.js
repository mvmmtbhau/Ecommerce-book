import instance from './api';

class CartService {
    constructor() {
        this.api = instance;
    }

    async getCart(id) {
        return (await this.api.get(`/cart/get-one/${id}`))
    }

    async addProductToCart(idCart, data) {
        return (await this.api.post(`/cart/add-to-cart/${idCart}`, data))
    }

    async removeProduct(idCart, data) {
        return (await this.api.post(`/cart/remove-product/${idCart}`, data))
    }

    async updateCart(idCart, data) {
        return (await this.api.post(`/cart/update-cart/${idCart}`, data))

    }
}

export default new CartService();