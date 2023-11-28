const cartService = require('../services/cart');
const productService = require('../services/product');
const wishlistService = require('../services/wishlist');
const userService = require('../services/user');

require('dotenv').config();

class UserController {
    async getCart(req, res, next) {
        try {
            const idUser = req.params.idUser;

            let cart;

            cart = await cartService.findOne({
                owner: idUser
            });

            if (!cart) {
                cart = await cartService.createNew({
                    owner: idUser
                })
            }

            return res.status(200).json({
                cart: cart,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: err });
        }
    }

    async addToCart(req, res, next) {
        try {
            const idCart = req.params.idCart;
            const idPro = req.body.idPro;
            const newQuantity = req.body.quantity;

            const cart = await cartService.findOne({ _id: idCart });
            const product = await productService.findOne({ _id: idPro });

            let newTotal = 0;
            let totalPrice = 0;
            let proInCart = false;
            let updateQuantity = 0;
            let newCart;
            let totalQuantity = newQuantity;

            cart.products.forEach((item, i) => {
                if (item.product._id.toString() == product._id.toString()) {
                    proInCart = true;
                    updateQuantity = newQuantity + item.quantity;
                    totalPrice += item.product.price * updateQuantity;
                    totalQuantity = updateQuantity;
                } else {
                    totalPrice += item.product.price * item.quantity;
                }
                newTotal += totalPrice;
            })

            if (!(totalQuantity <= product.quantity)) {
                return res.status(203).json({
                    msg: 'Số lượng thêm vượt quá số lượng sản phẩm có sẵn trong kho.',
                })
            }
            // console.log("Tổng giá", newTotal);
            // console.log('total price', totalPrice)
            // console.log('price item mới', product.price * newQuantity);

            if (proInCart) {
                newCart = await cartService.update(
                    {
                        _id: cart._id,
                        "products.product": product._id,
                    },
                    {
                        $set: {
                            "products.$.quantity": updateQuantity,
                            total: newTotal,
                        }
                    });
            } else {
                newTotal = (product.price * newQuantity) + totalPrice;
                newCart = await cartService.updateById(cart._id,
                    {
                        $push: {
                            products: {
                                product: product._id,
                                quantity: newQuantity,
                            }
                        },
                        total: Number(newTotal)
                    });
            }

            // console.log(newCart);
            if (newCart) {
                const newWishlist = await wishlistService.findAndUpdate(
                    {
                        owner: newCart.owner
                    },
                    {
                        $pullAll: {
                            items: [product._id]
                        }
                    })

                return res.status(201).json({
                    cart: newCart,
                    wishlist: newWishlist,
                    msg: 'Thêm vào giỏ hàng thành công!'
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    async removeProduct(req, res, next) {
        try {
            const idCart = req.params.idCart;
            const index = req.body.index;

            const cart = await cartService.findOne({ _id: idCart });

            let newTotal = cart.total;
            
            newTotal = newTotal - (cart.products[index].product.price * cart.products[index].quantity);
            cart.products.splice(index, 1);

            const updateCart = await cartService.update({
                _id: idCart,
            },
                {
                    $set: {
                        products: cart.products,
                        total: newTotal,
                    }
                }
            );

            return res.status(201).json({
                cart: updateCart,
                msg: 'Đã xóa sản phẩm ra giỏ hàng!'
            })

        } catch (err) {
            console.log(err);
        }
    }

    async updateCart(req, res, next) {
        try {
            const idCart = req.params.idCart;
            const index = req.body.index;
            const quantity = req.body.quantity;
            const idPro = req.body.idPro;

            let cart = await cartService.findOne({ _id: idCart })

            let product = await productService.findOne({ _id: idPro });

            let updateCart;
            let newTotal = 0;

            if (quantity > product.quantity) {
                cart.products[index].quantity = product.quantity;
                cart.products.forEach(item => {
                    newTotal += item.product.price * item.quantity
                });

                updateCart = await cartService.update(
                    {
                        _id: cart._id
                    },
                    {
                        $set: {
                            products: cart.products,
                            total: newTotal
                        }
                    }
                )

                return res.status(203).json({
                    cart: updateCart,
                    msg: `Rất tiếc bạn chỉ có thể mua tối đa ${product.quantity} đối với sản phẩm này.`
                })
            }

            cart.products[index].quantity = quantity;

            cart.products.forEach(item => {
                newTotal += item.product.price * item.quantity
            });

            updateCart = await cartService.update(
                {
                    _id: cart._id
                },
                {
                    $set: {
                        products: cart.products,
                        total: newTotal
                    }
                }
            )

            return res.status(201).json({
                cart: updateCart,
            })

        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new UserController();