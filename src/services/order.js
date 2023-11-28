import instance from './api';

class orderService {
    constructor() {
        this.api = instance;
    }

    async placeOrder(cart, shippingAddress) {
        return (await this.api.post(`/order/place-order`, {cart, shippingAddress}))
    }

    async getOrders(idUser, perPage, page) {
        return (await this.api.get(`/order/get-by-user/${idUser}?per_page=${perPage}&page=${page}`))
    }

    async adminGetOrders(perPage, page, filterUser, sortBy) {
        return (await this.api.get(`/order/admin/list?per_page=${perPage}&page=${page}&filter_user=${filterUser}&sortBy=${sortBy}`))
    }

    async adminDelivery(order) {
        return (await this.api.patch(`/order/admin/delivery/${order._id}`, order))
    }

    async userReceived(order) {
        return (await this.api.patch(`/order/received/${order._id}`, order))
    }

    async userDel(order) {
        return (await this.api.patch(`/order/del/${order._id}`))
    }

    async adminDel(order) {
        return (await this.api.patch(`/order/admin/del/${order._id}`))
    }

    async userUndoOrder(order) {
        return (await this.api.post(`/order/undo`, order))
    }

}

export default new orderService();