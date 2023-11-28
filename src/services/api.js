import axios from "axios";

const token = localStorage.getItem("token-hau");

axios.defaults.headers.common["authorization"] = `Bearer ` + token;

const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
  },
});

instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        //api sau khi login mới thêm bearer
        // console.log(config);
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);
instance.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      const config = error.config;
      const response = error?.response;
      if (response.status === 401) {
        // alert('Phiên đăng nhập kết thúc, xin đăng nhập lại');
        localStorage.removeItem("token-hau");
        window.location.href ="/";
        return Promise.reject(error);
      }
      if (response.status === 403) {
        console.log("vao day admin r");
        return Promise.reject(error);
      }
      // if (
      //   response.status === 401 &&
      //   response.data.errors &&
      //   response.data.errors.message === "jwt expired"
      // ) {
      //   const res = await authApi.refreshToken();
  
      //   if (res.elements) {
      //     /**
      //      * * Sau khi gọi refresh token thì chúng ta sẽ có accessToken mới
      //      * * và set vào localStorage sau đó set lại headers cho axios
      //      */
      //     localStorage.setItem("accessToken", res.elements.accessToken);
  
      //     instance.defaults.headers.common["Authorization"] =
      //       "Bearer " + res.elements.accessToken;
  
      //     return instance(config);
      //   }
      // }
      return Promise.reject(error);
    }
  );
export default instance;