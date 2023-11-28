import instance from './api';

class CategoryService {
    constructor() {
        this.api = instance;
    }

    async getCategories() {
        return (await this.api.get('/category'));   
    }

    async addNew(data) {
        return (await this.api.post('/category/add', data));
    }

    async updateCate(data) {
        return (await this.api.post('/category/update', data));
    }

    async deleteCate(id) {
        return (await this.api.delete('/category/delete/'+id));
    }

    // async updateAccount(data){
    //     return (await this.api(
    //         {
    //             method: 'POST',
    //             url: `/auth/update/${data.userId}`,
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             },
    //             data: data
    //         }
    //     ));
    // }
}

export default new CategoryService();