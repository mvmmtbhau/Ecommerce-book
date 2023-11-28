const wishlistService = require('../services/wishlist');
const cartService = require('../services/cart');
const productService = require('../services/product');
const orderService = require('../services/order');
const userService = require('../services/user');
const jwt = require('jsonwebtoken');

require('dotenv').config();

class OrderController {
    async getByUserId(req, res, next) {
        try {
            const idUser = req.params.idUser;
            const per_page = req.query.per_page;
            let skipNum = (req.query.page - 1) * per_page;

            const orders = await orderService.findLimit(
                {
                    owner: idUser,
                    userDel: false,
                },
                per_page,
                skipNum,
                {}
            );

            const totalOrders = await orderService.find({ owner: idUser, userDel: false, })

            const totalPage = Math.ceil(totalOrders.length / per_page)

            return res.status(200).json({
                orders: orders,
                totalPage: totalPage
            })
        } catch (err) {
            console.log(err);
        }
    }

    async placeOrder(req, res, next) {
        try {
            let idUser = req.body.cart.owner;
            let shippingAddress = req.body.shippingAddress.fullAddress;

            let province = req.body.shippingAddress.province;
            let district = req.body.shippingAddress.district;
            let ward = req.body.shippingAddress.ward;
            let address = req.body.shippingAddress.address;

            let ids = [];
            let orderProducts = [];

            const cart = await cartService.findOne({ _id: req.body.cart._id });
            const updateUser = await userService.update(cart.owner, {
                province: {
                    name: province.name,
                    code: province.code
                },
                district: {
                    name: district.name,
                    code: district.code
                },
                ward: {
                    name: ward.name,
                    code: ward.code
                },
                address: address
            })
            
            const newUser = await userService.findOne({_id: cart.owner});
            const jwtToken = jwt.sign({ ...newUser._doc }, process.env.SECRET_JWT, {
                expiresIn: '5d',
            });
            
            cart.products.forEach((item) => {
                ids.push(item.product._id);
            })

            const products = await productService.find({
                _id: {
                    $in: ids
                }
            })

            cart.products.forEach(async (item, index) => {
                let sanPhamDatHang = item;
                let sanPhamTrongKho = products.find(sp => sp._id.toString() === sanPhamDatHang.product._id.toString());

                if (!sanPhamTrongKho) {
                    cart.products.splice(index, 1);
                    let newTotal = cart.total - (cart.products[index].product.price * cart.products[index].quantity);
                    const updateCart = await cartService.update(
                        {
                            _id: cart._id,
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
                        msg: `Sản phẩm ${sanPhamDatHang.product.name} hiện không còn trong kho`,
                    })
                }

                if (sanPhamDatHang.quantity > sanPhamTrongKho.quantity) {
                    cart.products[index].quantity = sanPhamTrongKho.quantity;
                    let newTotal = 0;
                    cart.products.forEach(item => {
                        newTotal += item.product.price * item.quantity
                    });

                    const updateCart = await cartService.update(
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
                        msg: `Rất tiếc bạn chỉ có thể mua tối đa ${sanPhamTrongKho.quantity} đối với sản phẩm ${sanPhamTrongKho.name} này.`
                    })
                }

                orderProducts.push({
                    name: sanPhamDatHang.product.name,
                    price: sanPhamDatHang.product.price,
                    quantity: sanPhamDatHang.quantity,
                    images: sanPhamDatHang.product.images,
                    id: sanPhamDatHang.product._id,
                })

                const updatePro = await productService.update(sanPhamTrongKho._id,
                    {
                        quantity: (sanPhamTrongKho.quantity - sanPhamDatHang.quantity),
                        sold: (sanPhamTrongKho.sold + sanPhamDatHang.quantity)
                    });
            })


            const order = await orderService.createNew({
                products: orderProducts,
                total: cart.total,
                owner: cart.owner,
                shippingAddress: shippingAddress,
            })

            if (order) {
                const updateCart = await cartService.update(
                    {
                        _id: cart._id,
                    },
                    {
                        $set: {
                            products: [],
                            total: 0
                        }
                    }
                )

                return res.status(201).json({
                    cart: updateCart,
                    user: jwtToken,
                    msg: 'Đặt hàng thành công!'
                })
            }

        } catch (err) {
            console.log(err)
        }
    }

    async adminGet(req, res, next) {
        try {
            const per_page = req.query.per_page;
            const filterUser = req.query.filter_user;
            const sortBy = req.query.sortBy;
            let skipNum = (req.query.page - 1) * per_page;

            let querySort = {}
            if(sortBy == 1) {
                querySort = {
                    "total": 1
                }
            }

            if(sortBy == 2) {
                querySort = {
                    "total": -1
                }
            }

            const orders = await orderService.findLimit(
                {
                    adminDel: false,
                    owner: filterUser ? filterUser : {$exists: true}
                },
                per_page,
                skipNum,
                querySort,
            )

            const totalOrders = await orderService.find({ adminDel: false })

            const totalPage = Math.ceil(totalOrders.length / per_page)

            return res.status(200).json({
                orders: orders,
                totalPage: totalPage
            })
        } catch (e) {
            console.log(e);
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const idOrder = req.params.idOrder;
            const orderStatus = req.body.status;

            if (orderStatus == 0) {
                const updateOrder = await orderService.updateById(idOrder,
                    {
                        $set: {
                            status: 1
                        }
                    }
                )

                if (!updateOrder) return res.status(203).json({
                    msg: `Có lỗi, không tìm thấy đơn hàng.`
                })

                return res.status(201).json({
                    order: updateOrder,
                    msgAdmin: 'Đơn hàng đã được giao đi.',
                    msgUser: `Đơn hàng ${updateOrder._id} đang trên đường giao đến.`
                })
            }

            if (orderStatus == 1) {
                const updateOrder = await orderService.updateById(idOrder,
                    {
                        $set: {
                            status: 2
                        }
                    }
                )

                if (!updateOrder) return res.status(203).json({
                    msg: `Có lỗi, không tìm thấy đơn hàng.`
                })

                return res.status(201).json({
                    order: updateOrder,
                    msgUser: 'Cảm ơn bạn đã tin tưởng và mua hàng!',
                    msgAdmin: `Khách hàng ${updateOrder.owner.fullName} đã xác nhận nhận được đơn hàng ${updateOrder._id}.`
                })
            }
        } catch (e) {
            console.log(e);
        }
    }

    async userDel(req, res, next) {
        try {
            const idOrder = req.params.idOrder;

            const updateOrder = await orderService.updateById(idOrder,
                {
                    $set: {
                        userDel: true,
                    }
                })

            if (!updateOrder) return res.status(203).json({
                msg: `Có lỗi, không tìm thấy đơn hàng.`
            })

            return res.status(201).json({
                msg: `Xóa đơn hàng ${idOrder} thành công.`
            })
        } catch (e) {
            console.log(e);
        }
    }

    async adminDel(req, res, next) {
        try {
            const idOrder = req.params.idOrder;

            const updateOrder = await orderService.updateById(idOrder,
                {
                    $set: {
                        adminDel: true,
                    }
                })

            if (!updateOrder) return res.status(203).json({
                msg: `Có lỗi, không tìm thấy đơn hàng.`
            })

            return res.status(201).json({
                msg: `Xóa đơn hàng ${idOrder} thành công.`
            })
        } catch (e) {
            console.log(e);
        }
    }

    async userUndo(req, res, next) {
        try {
            const idOrder = req.body._id;
            const orderProducts = req.body.products;

            let ids = [];

            orderProducts.forEach(product => ids.push(product.id));

            // console.log(idOrder);
            // console.log(orderProducts)
            // console.log(ids);

            const delOrder = await orderService.deleteById(idOrder);

            if (!delOrder) return res.status(203).json({
                msg: `Không tìm thấy đơn hàng ${idOrder}.`
            })

            const products = await productService.find({
                _id: {
                    $in: ids
                }
            })

            orderProducts.forEach(async (item) => {
                const spTrongKho = products.find(sp => sp._id == item.id);

                const updateProduct = await productService.update(spTrongKho._id,
                    {
                        $set: {
                            quantity: (spTrongKho.quantity + item.quantity),
                            sold: (spTrongKho.sold - item.quantity)
                        }
                    })
            })

            return res.status(201).json({
                msg: 'Hủy đặt đơn hàng thành công.'
            })

        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new OrderController();