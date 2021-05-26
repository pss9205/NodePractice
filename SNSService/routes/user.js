const express = require("express");

const { isLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();
const cache = require("../passport/cache");
router.patch("/", isLoggedIn, async (req, res, next) => {
  try {
    nick = decodeURIComponent(req.body["newNick"]);
    let result = await User.update(
      { nick: nick },
      { where: { id: req.user.id } }
    );
    if (result == 1) {
      cache.setDirty(req.user.id);
      res.send("success");
    } else res.status(404).send("no user");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      cache.setDirty(req.user.id);
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Unfollow. delete method호출해서 처리
router.delete("/:id/unfollow", isLoggedIn, async (req, res, next) => {
  try {
    //user 찾음
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      //user의 following리스트에서 파라미터와 일치하는 것 찾음
      const follow = await user.getFollowings({
        where: { id: req.params.id },
      });
      if (follow) {
        //찾으면 해당 레코드 삭제
        await user.removeFollowing(follow);
        cache.setDirty(req.user.id);
        res.send("success");
      }
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
