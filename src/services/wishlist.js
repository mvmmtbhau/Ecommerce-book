import instance from './api';

class userService {
    constructor() {
        this.api = instance;
    }

    async getWishlist(idUser) {
        return (await this.api.get(`/wishlist/get-one/${idUser}`))
    }

    async addNew(idWish, data) {
        return (await this.api.patch('/wishlist/add/'+idWish, data));
    }

    async removeItem(idWish, idPro) {
        return (await this.api.patch(`/wishlist/remove/${idWish}`, {idPro}));
    }

    // async updateCate(data) {
    //     return (await this.api.post('/category/update', data));
    // }

    // async deleteCate(id) {
    //     return (await this.api.delete('/category/delete/'+id));
    // }

    // // async updateAccount(data){
    // //     return (await this.api(
    // //         {
    // //             method: 'POST',
    // //             url: `/auth/update/${data.userId}`,
    // //             headers: {
    // //                 "Content-Type": "multipart/form-data",
    // //             },
    // //             data: data
    // //         }
    // //     ));
    // // }
}

export default new userService();