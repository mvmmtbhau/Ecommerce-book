const express = require('express');

const category = require('../controllers/category');

const router = express.Router();

router.post('/add', category.addNew);

router.post('/update', category.updateCate);

router.delete('/delete/:id', category.deleteCate);

router.get("/", category.getCategories);

module.exports = router;