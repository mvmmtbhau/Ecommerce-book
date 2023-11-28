const express = require('express');

const order = require('../controllers/order');

const router = express.Router();

router.post('/place-order', order.placeOrder);
router.post('/undo', order.userUndo)

router.patch('/admin/delivery/:idOrder', order.updateOrderStatus);
router.patch('/admin/del/:idOrder',order.adminDel);

router.patch('/received/:idOrder', order.updateOrderStatus);
router.patch('/del/:idOrder',order.userDel);


router.get('/get-by-user/:idUser', order.getByUserId)

router.get('/admin/list', order.adminGet);

module.exports = router;