const productRoute = require('./product');

function route(app) {
    app.use('/api/products', productRoute);
}

module.exports = route;