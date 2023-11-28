const userService = require('../services/user');
const cartService = require('../services/cart');
const wishlistService = require('../services/wishlist');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserController {
    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            if (!id) return res.status(203).json({
                err: 1,
                msg: 'Missing input'
            })

            const user = await userService.findOne({
                id: id
            }, {
                password: 0,
            });

            if (!user) return res.status(203).json({
                err: 0,
                msg: 'Không tìm thấy user',
                token,
            })

            let cart;
            cart = await cartService.findOne({ owner: user._id });

            if (!cart) {
                cart = await cartService.createNew({ owner: user._id });
            }

            let wishlist;
            wishlist = await wishlistService.findOne({ owner: user._id });

            if (!wishlist) {
                wishlist = await wishlistService.createNew({ owner: user._id });
            }

            const jwtToken = jwt.sign({ ...user._doc }, process.env.SECRET_JWT, {
                expiresIn: '5d',
            });

            return res.status(200).json({
                accessToken: jwtToken,
                cart,
                wishlist,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: err })
        }
    }

    async signUp(req, res, next) {
        try {
            const user = req.body;

            const isExisted = await userService.findOne({
                email: user.email,
                typeLogin: 'local'
            }, {
                password: 0
            })

            if (isExisted) return res.status(202).json({
                msg: 'Email đã tồn tại'
            });

            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            user.password = bcrypt.hashSync(req.body.password, salt);

            const signup = await userService.createNew({
                fullName: user.fullName,
                email: user.email,
                password: user.password
            })

            if (signup) {
                const data = await userService.findOne({ _id: signup._id }, { password: 0 });

                let cart;
                cart = await cartService.findOne({ owner: signup._id });

                if (!cart) {
                    cart = await cartService.createNew({ owner: signup._id });
                }

                let wishlist;
                wishlist = await wishlistService.findOne({ owner: user._id });

                if (!wishlist) {
                    wishlist = await wishlistService.createNew({ owner: user._id });
                }

                const jwtToken = jwt.sign({ ...data._doc }, process.env.SECRET_JWT, {
                    expiresIn: '5d',
                });

                return res.status(201).json({
                    profile: jwtToken,
                    cart,
                })
            }

        } catch (err) {
            console.log(err);
            return res.status(500).json({ err })
        }
    }

    async signIn(req, res, next) {
        try {
            const data = req.body;

            const user = await userService.findOne({
                email: data.email,
                typeLogin: 'local'
            })

            if (!user) return res.status(202).json({
                msg: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });

            const checkPassword = bcrypt.compareSync(data.password, user.password);

            if (!checkPassword) {
                return res.status(202).json({
                    msg: 'Tên đăng nhập hoặc mật khẩu không đúng'
                });
            };

            let cart;
            cart = await cartService.findOne({ owner: user._id });

            if (!cart) {
                cart = await cartService.createNew({ owner: user._id });
            }

            let wishlist;
            wishlist = await wishlistService.findOne({ owner: user._id });

            if (!wishlist) {
                wishlist = await wishlistService.createNew({ owner: user._id });
            }

            user.password = '';

            const jwtToken = jwt.sign({ ...user._doc }, process.env.SECRET_JWT, {
                expiresIn: '5d',
            });

            return res.status(201).json({
                profile: jwtToken,
                cart: cart,
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({ err })
        }
    }

    async updateProfile(req, res, next) {
        try {
            let updateUser;
            if (!req.file) {
                updateUser = await userService.update(
                    req.body.id,
                    {
                        fullName: req.body.fullName
                    }
                )
            } else {
                updateUser = await userService.update(
                    req.body.id,
                    {
                        fullName: req.body.fullName,
                        avatar: req.file.filename
                    }
                )
            }

            if(!updateUser) return res.status(203).json({
                msg: 'Không tìm thấy tài khoản hoặc có lỗi gì đó trong quá trình cập nhật'
            })

            const newUser = await userService.findOne({_id: updateUser._id}, { password: 0 })

            const jwtToken = jwt.sign({ ...newUser._doc }, process.env.SECRET_JWT, {
                expiresIn: '5d',
            });

            return res.status(201).json({
                user: jwtToken,
                msg: 'Cập nhật thông tin tài khoản thành công!'
            })
        } catch (e) {
            console.log(e);
        }
    }

    async updateAddress(req, res, next) {
        try {
            const idUser = req.params.idUser;
            const data = req.body;
            
            const updateUser = await userService.update(idUser, data)

            if(!updateUser) return res.status(203).json({
                msg: 'Không tìm thấy tài khoản hoặc có lỗi gì đó trong quá trình cập nhật'
            })

            const newUser = await userService.findOne({_id: updateUser._id},{ password: 0 })

            const jwtToken = jwt.sign({ ...newUser._doc }, process.env.SECRET_JWT, {
                expiresIn: '5d',
            });

            return res.status(201).json({
                user: jwtToken,
                msg: 'Cập nhật địa chỉ giao hàng thành công!'
            })
        } catch (e) {
            console.log(e);
        }
    }

    async updatePassword(req, res, next) {
        try {
            const idUser = req.params.idUser;
            const data = req.body;

            const user = await userService.findOne({_id: idUser});

            if(!user) return res.status(203).json({
                msg: 'Không tìm thấy tài khoản hoặc có lỗi gì đó trong quá trình cập nhật'
            })

            const checkPassword = bcrypt.compareSync(data.old, user.password);

            if (!checkPassword) {
                return res.status(203).json({
                    msg: 'Mật khẩu không đúng, vui lòng nhập lại mật khẩu và xin cẩn thận với thao tác này.'
                });
            };
            
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const newP = bcrypt.hashSync(data.newP, salt);
            
            const updateUser = await userService.update(idUser, {password: newP })

            return res.status(201).json({
                msg: 'Thay đổi mật khẩu thành công thành công!'
            })
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new UserController();