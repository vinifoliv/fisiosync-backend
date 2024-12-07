import express from "express";
import passport from "passport";

export const auth = express.Router();

auth.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/");
});
