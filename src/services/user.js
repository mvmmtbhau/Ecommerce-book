import instance from './api';

class userService {
    constructor() {
        this.api = instance;
    }

    async getOne(id, tokenLogin) {
        return (await this.api.get(`/user/get-one/${id}`))
    }

    async signUp(data){
        return (await this.api.post('/user/signup', data))
    }

    async signIn(data){
        return (await this.api.post('/user/signin', data))
    }

    async updateProfile(data){
        return (await this.api(
            {
                method: 'POST',
                url: `/user/update-profile/${data.id}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: data
            }
        ));
    }

    async updateAddress(id, data) {
        return (await this.api.post(`/user/update-address/${id}`, data))
    }

    async updatePassword(id, data) {
        return (await this.api.post(`/user/update-password/${id}`, data))
    }
}

export default new userService();