import { createStore, createLogger } from "vuex";
import user from './modules/user';
import cart from './modules/cart';
import wishlist from './modules/wishlist';

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    user,
    cart,
    wishlist,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : "" ,
});

// Nếu muốn xem cái gì thay đổi thì thêm createLogger() vào vào plugins