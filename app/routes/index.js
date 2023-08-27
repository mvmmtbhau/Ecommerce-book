const productRoute = require('./product');
const categoryRoute = require('./category');

function route(app) {
    app.use('/api/product', productRoute);
    app.use('/api/category', categoryRoute);
}

module.exports = route;