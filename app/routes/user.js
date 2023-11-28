const express = require('express');

const user = require('../controllers/user');
const upload = require("../utils/upload");

const router = express.Router();

router.post('/signup', user.signUp)
router.post('/signin', user.signIn)

router.post('/update-profile/:idUser',upload('avatars').single('avatar'), user.updateProfile);
router.post('/update-address/:idUser', user.updateAddress);
router.post('/update-password/:idUser', user.updatePassword);

router.get("/get-one/:id", user.getOne);

module.exports = router;