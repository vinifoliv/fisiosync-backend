import express from 'express';
import passport from 'passport';

const auth = express.Router();

auth.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

export default auth;