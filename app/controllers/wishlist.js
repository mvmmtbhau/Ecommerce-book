const wishlistService = require('../services/wishlist');
const cartService = require('../services/cart');
const productService = require('../services/product');

require('dotenv').config();

class WishlistController {
    async getWishlist(req, res, next) {
        try {
            const idUser = req.params.idUser;
            let wishlist;

            wishlist = await wishlistService.findOne({
                owner: idUser,
            })

            if (!wishlist) {
                wishlist = await wishlistService.createNew({
                    owner: idUser
                })
            }


            return res.status(200).json({
                wishlist: wishlist,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: err });
        }
    }

    async addToWishlist(req, res, next) {
        try {
            const idWish = req.params.id;
            const idPro = req.body.idPro;
            const idCart = req.body.idCart;

            const wishlist = await wishlistService.findOne({ _id: idWish });
            // console.log('wishlist', wishlist);

            const cart = await cartService.findOne({ _id: idCart });
            // console.log('cart', cart);

            const product = await productService.findOne({ _id: idPro });

            if(!product) return res.status(203).json({
                msg: 'Sản phẩm không tồn tại'
            })

            let proInCart = false;
            cart.products.forEach(item => {
                if(item.product._id.toString() === product._id.toString()) proInCart = true;
            });

            if (proInCart) return res.status(202).json({
                msg: 'Sản phẩm đã có trong giỏ hàng'
            })

            let proInWish = false;
            wishlist.items.forEach(item => {
                if(item._id.toString() === product._id.toString()) proInWish = true;
            })

            if (proInWish) return res.status(202).json({
                msg: 'Sản phẩm đã có trong Wishlist'
            })

            const update = await wishlistService.update(wishlist._id,
                {
                    $push: {
                        items: product._id
                    }
                });
            
            return res.status(201).json({
                wishlist: update,
                msg: 'Đã thêm sản phẩm vào Wishlist'    
            })
        } catch (err) {
            console.log(err);
        }
    }

    async removeItem(req, res, next) {
        try {
            const idWish = req.params.id;
            const idItem = req.body.idPro;

            const del = await wishlistService.update(idWish, {
                $pullAll: {
                    items: [idItem]
                }
            })

            return res.status(201).json({
                wishlist: del,
                msg: 'Xóa thành công',
            })
        } catch (err) { 
            console.log(err)
        }
    }
}

module.exports = new WishlistController();