const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
require('dotenv').config();

const { User, Cart } = require('./app/models');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const isExisted = await User.findOne({
            id: profile.id
        })

        if (!isExisted) {
            const user = new User({
                id: profile.id,
                fullName: profile._json.name,
                avatar: profile._json.picture,
                email: profile._json.email,
                typeLogin: profile.provider,
            });
            await user.save();

            const cart = new Cart({
                owner: user._id
            });
            await cart.save();
            return done(null, user)
        }

        return done(null, isExisted)
    } catch (err) {
        console.log('passport: ', err)
    }
}));