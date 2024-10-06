const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const {userModel} = require('../models/user.model');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  "/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.picture
        };

        try {
            let user = await userModel.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            } else {
                user = await new userModel(newUser).save();
                done(null, user);
            }
        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        userModel.findById(id)
            .then(user => {
                done(null, user);
            });
    });
};
