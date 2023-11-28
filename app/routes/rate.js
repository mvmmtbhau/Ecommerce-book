const express = require('express');

const rate = require('../controllers/rate');

const router = express.Router();

router.post('/rating-product', rate.rating )

router.get('/get-by-product/:idProduct', rate.getByProductId)

module.exports = router;