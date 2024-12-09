// src/config/passport-config.ts
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import { User } from '../repository/User';
dotenv.config();

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'email', 'name', 'picture'],
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await User.getUserById(id);
  done(null, user);
});
