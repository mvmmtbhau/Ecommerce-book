

class ProductController {
    async getProduct (req, res, next) {
        try {
            console.log('Lấy sản phẩm')
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new ProductController();