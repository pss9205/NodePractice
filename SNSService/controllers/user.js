const User = require("../models/user");
const cache = require("../passport/cache");
exports.addFollowing = async (req, res, next) => {
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
};

exports.unFollowing = async (req, res, next) => {
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
};

exports.updateNickName = async (req, res, next) => {
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
};
