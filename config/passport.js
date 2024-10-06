const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { userModel } = require('../models/user.model'); // Ensure this path is correct

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/users/api/v1/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile._json.picture // Use _json to access the raw profile data
        };

        try {
            // Check if user already exists
            let user = await userModel.findOne({ googleId: profile.id });
            if (user) {
                // User exists, return the user
                done(null, user);
            } else {
                // Create a new user
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

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user); 
        } catch (err) {
            console.error(err);
            done(err, null); 
        }
    });
};
