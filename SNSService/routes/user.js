const express = require("express");

const { isLoggedIn } = require("./middlewares");
const {
  addFollowing,
  unFollowing,
  updateNickName,
} = require("../controllers/user");
const User = require("../models/user");

const router = express.Router();
const cache = require("../passport/cache");
router.patch("/", isLoggedIn, updateNickName);

router.post("/:id/follow", isLoggedIn, addFollowing);

//Unfollow. delete method호출해서 처리
router.delete("/:id/unfollow", isLoggedIn, unFollowing);

module.exports = router;
