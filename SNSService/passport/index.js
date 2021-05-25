const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");
const UserDB = {};
module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    if (id in UserDB) {
      done(null, UserDB[id]);
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
        ],
      })
        .then((user) => {
          UserDB[id] = user;
          done(null, user);
        })
        .catch((err) => done(err));
    }
  });

  local();
  kakao();
};
