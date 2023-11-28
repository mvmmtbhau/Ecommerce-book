const productService = require('../services/product');
const categoryService = require('../services/category');
const rateService = require('../services/rate');

class ProductController {
    async getProducts(req, res, next) {
        try {
            const per_page = req.query.per_page;
            const cateId = req.query.cate_id == 'undefined' ? '' : req.query.cate_id;
            const sortCode = req.query.sort_code == 'undefined' ? '' : req.query.sort_code;
            const searchTerm = req.query.search == 'undefined' ? '' : req.query.search;
            const regexQuery = new RegExp( searchTerm, 'i');
            let skipNum = (req.query.page - 1) * per_page;

            let querySort = {}
            if (sortCode == 1) {
                querySort = {
                    "createdAt": -1
                }
            }

            if (sortCode == 2) {
                querySort = {
                    "price": 1
                }
            }

            if (sortCode == 3) {
                querySort = {
                    "price": -1
                }
            }

            let products = await productService.findLimit({
                category: cateId ? cateId : { $exists: true },
                name: { $regex: regexQuery }
            }, per_page, skipNum, querySort);

            for (const [index, product] of products.entries()) {
                const rates = await rateService.find({ ofProduct: product._id });

                let totalStar = 0;
                rates.forEach(rate => {
                    totalStar += rate.star
                })

                const avgStar = (totalStar / rates.length).toFixed(1);
                products[index] = { ...products[index]._doc, totalRate: rates.length };
                products[index] = { ...products[index], avgStar: Number(avgStar) };
            }

            const totalProducts = await productService.find({ category: cateId ? cateId : { $exists: true }, name: { $regex: regexQuery } })

            const totalPage = Math.ceil(totalProducts.length / per_page)
            let shuffledProducts = '';

            if (!sortCode) {
                shuffledProducts = products.sort(() => 0.5 - Math.random());
            }
            
            return res.status(200).json({
                products: shuffledProducts ? shuffledProducts : products,
                totalPage,
            })
        } catch (err) {
            console.log(err);
        }
    }

    async getById(req, res, next) {
        try {
            const id = req.params.id;

            const product = await productService.findOne({ _id: id });
            const rates = await rateService.find({ ofProduct: product._id });

            let totalStar = 0;
            rates.forEach(rate => {
                totalStar += rate.star
            })

            const avgStar = (totalStar / rates.length).toFixed(1);

            if (!product) return res.status(203).json({
                msg: 'Không tìm thấy sản phẩm',
            });

            return res.status(200).json({
                product: product,
                totalRate: rates.length,
                avgStar: avgStar,
            })
        } catch (e) {
            console.log(e);
        }
    }

    async adminGet(req, res, next) {
        try {
            const products = await productService.find({});

            return res.status(200).json({
                products
            })
        } catch (e) {
            console.log(e);
        }
    }

    async getNew(req, res,next) {
        try {
            const productNews = await productService.search({}, 4,
                {
                    "createdAt": -1
                })

            return res.status(200).json({
                products: productNews
            })
        } catch (e) {
            console.log(e);
        }
    }

    async getRecommend(req, res,next) {
        try {
            const recommendProducts = await productService.search({}, 4,
                {
                    "sold": -1
                })

            return res.status(200).json({
                products: recommendProducts
            })
        } catch (e) {
            console.log(e);
        }
    }


    async searchProduct(req, res, next) {
        try {
            const searchTerm = req.query.search_term.toLowerCase();
            const regexQuery = new RegExp(searchTerm, 'i');

            const products = await productService.search(
                {
                    name: { $regex: regexQuery }
                }, 5
            )

            return res.status(200).json({
                products: products
            })
        } catch (e) {
            console.log(e);
        }
    }

    async addNewProduct(req, res, next) {
        try {
            const data = req.body;
            const isNullish = Object.values(data).some(value => {
                if (!value) return true;
                return false
            })
            if (isNullish) return res.status(202).json({
                msg: "Bạn chưa nhập đầy đủ thông tin"
            })

            const add = await productService.createNew({
                name: data.name,
                price: data.price,
                author: data.author,
                quantity: data.quantity,
                category: data.category,
                description: data.description,
                images: req.files
            })

            if (add) {
                const cate = await categoryService.findOne({ _id: data.category });
                const updateCate = await categoryService.update(cate._id, { num: cate.num + 1 })

                return res.status(201).json({
                    msg: 'Thêm sản phẩm thành công'
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const data = req.body;

            const oldPro = await productService.findOne({ _id: data.id });
            const isNullish = Object.values(data).some(value => {

                if (!value) return true;
                return false
            })
            if (isNullish) return res.status(202).json({
                msg: "Bạn chưa nhập đầy đủ thông tin"
            })

            const update = await productService.update(data.id,
                {
                    name: data.name,
                    price: data.price,
                    author: data.author,
                    quantity: data.quantity,
                    category: data.category,
                    description: data.description
                })


            if (!update) return res.status(203).json({
                msg: 'Không tìm thấy sản phẩm'
            })

            if (data.category._id !== oldPro.category._id) {
                const updateCateOld = await categoryService.update(oldPro.category._id, { $inc: { num: -1 }  })

                const updateCateNew = await categoryService.update(data.category._id, { $inc: { num: +1 }  })
            }

            return res.status(201).json({
                msg: 'Cập nhật sản phẩm thành công'
            })
        } catch (err) {
            console.log(err);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const id = req.params.id;

            const delProduct = await productService.delete(id);

            if (!delProduct) return res.status(202).json({
                msg: 'Không tìm thấy sản phẩm'
            })

            const updateCate = await categoryService.update(delProduct.category, { $inc: {num: -1} })

            return res.status(200).json({
                msg: 'Xóa sản phẩm thành công'
            })
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new ProductController();