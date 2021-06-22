const express = require("express");
const {
  saveUser,
  profile,
  join,
  pages,
  hashtag,
} = require("../controllers/pages");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

router.use(saveUser);

router.get("/profile", isLoggedIn, profile);

router.get("/join", isNotLoggedIn, join);

router.get("/", pages);

router.get("/hashtag", hashtag);

module.exports = router;
