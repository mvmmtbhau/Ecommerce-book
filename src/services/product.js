import instance from './api';

class CategoryService {
    constructor() {
        this.api = instance;
    }

    async getProducts(perPage, page, cateId, sortCode, search) {
        return (await this.api.get(`/product?per_page=${perPage}&page=${page}&cate_id=${cateId}&sort_code=${sortCode}&search=${search}`));   
    }

    async getNewProduct() {
        return (await this.api.get('/product/new'))
    }

    async getRecommend() {
        return (await this.api.get('/product/recommend'))

    }

    async productSearch(searchTerm) {
        return (await this.api.get(`/product/search?search_term=${searchTerm}`))
    }

    async adminGet() {
        return (await this.api.get('/product/admin-get/'))
    }
    
    async getById(id) {
        return (await this.api.get('/product/detail/'+id))
    }

    async addNew(data) {
        return (await this.api(
            {
                method: 'POST',
                url: "/product/add",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: data
            }
        ));
    }

    async updateProduct(data) {
        return (await this.api.post('/product/update', data));
    }

    async deleteProduct(id) {
        return (await this.api.delete('/product/delete/'+id));
    }
}

export default new CategoryService();