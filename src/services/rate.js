import instance from './api';

class RateService {
    constructor() {
        this.api = instance;
    }

    async getByProductId(id, perPage, page ) {
        return (await this.api.get(`/rate/get-by-product/${id}?per_page=${perPage}&page=${page}`));   
    }

    async ratingProduct(data) {
        return (await this.api.post(`/rate/rating-product`, data))
    }
}

export default new RateService();