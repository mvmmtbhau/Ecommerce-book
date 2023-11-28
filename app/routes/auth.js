const express = require('express');
const router = express.Router();
const passport = require('passport');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const user = require('../controllers/user');

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
        req.user = profile;
        next();
    })(req, res, next)
}, (req, res) => {
    // console.log(req?.user)
    const jwtToken = jwt.sign({ ...req?.user._doc }, process.env.SECRET_JWT, {
        expiresIn: '5d',
    });

    if(req?.user.role == 'admin') {
        res.redirect(`${process.env.URI_CLIENT}/admin/dashboard?valid=${jwtToken}`)
    } else {
        res.redirect(`${process.env.URI_CLIENT}/?valid=${jwtToken}`)
    }
});

module.exports = router;