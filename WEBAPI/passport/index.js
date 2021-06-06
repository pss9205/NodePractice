const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const { User, Post } = require("../models");
const cache = require("./cache");
module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    if (cache.find(id)) {
      done(null, cache.get(id));
    } else {
      User.findOne({
        where: { id },
        include: [
          {
            model: User,
            attributes: ["id", "nick"],
            as: "Followers",
          },
          {
            model: User,
            attributes: ["id", "nick"],
            as: "Followings",
          },
          {
            model: Post,
            attributes: ["id"],
            as: "Likes",
          },
        ],
      })
        .then((user) => {
          cache.add(user);
          done(null, user);
        })
        .catch((err) => done(err));
    }
  });

  local();
  kakao();
};
