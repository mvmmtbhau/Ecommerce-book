const express = require('express');

const product = require('../controllers/product');
const upload = require("../utils/upload");
const router = express.Router();

router.post('/add', upload('products').array('photos', 4), product.addNewProduct);
router.post('/update', product.updateProduct);

router.delete('/delete/:id', product.deleteProduct)

router.get('/detail/:id', product.getById);
router.get('/search', product.searchProduct)
router.get('/new', product.getNew)
router.get('/recommend', product.getRecommend)

router.get('/', product.getProducts);
router.get('/admin-get', product.adminGet)

module.exports = router;