const orderService = require('../services/order');
const rateService = require('../services/rate');

class RateController {
    async rating(req, res ,next) {
        try {
            const idOrder = req.body.order._id;
            const idUser = req.body.order.owner._id;
            const products = req.body.order.products;
            const star = req.body.star;
            const showName = req.body.showName;
            const textRate = req.body.text;

            const updateOrder = await orderService.updateById(idOrder, {userRate: true});

            if(!updateOrder) return res.status(203).json({
                msg: 'Không tìm thấy đơn hàng này, vui lòng kiểm tra lại.'
            })

            products.forEach(async (product) => {
                const newRate = await rateService.createNew({
                    star: star,
                    showName: showName,
                    textRate: textRate,
                    ofProduct: product.id,
                    owner: idUser,
                })
            })

            return res.status(201).json({
                msg: 'Cảm ơn bạn đã đánh giá!',
            })
        } catch (e) {
            console.log(e);
        }
    }

    async getByProductId(req, res,next) {
        try {
            const idProduct = req.params.idProduct;
            const per_page = req.query.per_page;
            let skipNum = (req.query.page - 1) * per_page;

            const rates = await rateService.findLimit(
                {
                    ofProduct: idProduct
                },
                per_page,
                skipNum,
                {
                    "createdAt": -1
                }
            );

            const totalRates = await rateService.find({ ofProduct: idProduct })

            const totalPage = Math.ceil(totalRates.length / per_page)

            return res.status(200).json({
                rates: rates,
                totalPage,
            })
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new RateController();