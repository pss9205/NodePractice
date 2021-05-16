const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  //add to locals because those are common values
  res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerList = [];
  next();
});

router.get("/profile", (req, res) => {
  res.render("profile", { title: "My Profile" });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "Register Account" });
});

router.get("/", (req, res, next) => {
  const twits = [];
  res.render("main", {
    title: "NodeBird",
    twits,
  });
});

module.exports = router;
