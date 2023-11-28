const express = require('express');

const cart = require('../controllers/cart');

const router = express.Router();

router.post('/add-to-cart/:idCart', cart.addToCart)
router.post('/remove-product/:idCart', cart.removeProduct)
router.post('/update-cart/:idCart', cart.updateCart);

router.get("/get-one/:idUser", cart.getCart);

module.exports = router;