const express = require('express');

const category = require('../controllers/category');

const router = express.Router();

router.post('/add', category.addNew)

router.get("/", category.getCategories);

module.exports = router;