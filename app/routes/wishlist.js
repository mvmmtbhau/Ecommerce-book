const express = require('express');

const wishlist = require('../controllers/wishlist');

const router = express.Router();

router.patch('/add/:id', wishlist.addToWishlist);
router.patch('/remove/:id', wishlist.removeItem);

router.get("/get-one/:idUser", wishlist.getWishlist);


module.exports = router;