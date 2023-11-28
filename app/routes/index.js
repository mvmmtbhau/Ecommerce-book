const productRoute = require('./product');
const categoryRoute = require('./category');
const userRoute = require('./user');
const authRoute = require('./auth');
const cartRoute = require('./cart');
const wishlistRoute = require('./wishlist');
const orderRoute = require('./order');
const rateRoute = require('./rate');

function route(app) {
    app.use('/api/product', productRoute);
    app.use('/api/category', categoryRoute);
    app.use('/api/user', userRoute);
    app.use('/api/auth', authRoute);
    app.use('/api/cart', cartRoute);
    app.use('/api/wishlist', wishlistRoute);
    app.use('/api/order', orderRoute);
    app.use('/api/rate', rateRoute);
}

module.exports = route;