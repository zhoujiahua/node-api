const JwtStrategy = require("passport-jwt").Strategy;
ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, async (payload, done) => {
        try {
            let findUser = await User.findById(payload.id);
            if (!findUser) return done(null, false);
            return done(null, findUser);
        } catch (error) {
            console.log(error)
        }
    }));
}