import instance from './api';

class CategoryService {
    constructor() {
        this.api = instance;
    }

    async getCategories() {
        return (await this.api.get('/category'));   
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