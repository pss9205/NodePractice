const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { verifyToken } = require("./middlewares");
const apiLimiter = require("./apiLimiter");
const { Domain, User, Post, Hashtag } = require("../models");
const url = require("url");
const router = express.Router();

router.use(async (req, res, next) => {
  try {
    const domain = await Domain.findOne({
      where: { host: url.parse(req.get("origin")).host },
    });
    if (domain) {
      cors({
        origin: req.get("origin"),
        credentials: true,
      })(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    next();
  }
});

router.post("/token", apiLimiter, async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { frontSecret: clientSecret },
      include: {
        model: User,
        attribute: ["nick", "id"],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "unregistered domain",
      });
    }
    const token = jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
        issuer: "pss",
      }
    );
    return res.json({
      code: 200,
      message: "token was issued",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "server error",
    });
  }
});

router.get("/test", verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded);
});

router.get("/posts/my", verifyToken, apiLimiter, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: "Server Error",
      });
    });
});

router.get(
  "/posts/hashtag/:title",
  verifyToken,
  apiLimiter,
  async (req, res) => {
    try {
      const hashtag = await Hashtag.findOne({
        where: { title: req.params.title },
      });
      if (!hashtag) {
        return res.status(404).json({
          code: 404,
          message: "Data Not Found",
        });
      }
      const posts = await hashtag.getPosts();
      return res.json({
        code: 200,
        payload: posts,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: "Server Error",
      });
    }
  }
);

router.get("/following/my", verifyToken, apiLimiter, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.decoded.id } });
    const followings = await user.getFollowings({
      attributes: ["email", "nick"],
      joinTableAttributes: [], //to remove join table from select query https://github.com/sequelize/sequelize/issues/3664
    });
    if (followings) {
      return res.json({ code: 200, payload: followings });
    } else {
      return res.status(404).json({
        code: 404,
        message: "Data Not Found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server Error",
    });
  }
});

router.get("/follower/my", verifyToken, apiLimiter, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.decoded.id } });
    const followers = await user.getFollowers({
      attributes: ["email", "nick"],
      joinTableAttributes: [],
    });
    if (followers) {
      return res.json({ code: 200, payload: followers });
    } else {
      return res.status(404).json({
        code: 404,
        message: "Data Not Found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server Error",
    });
  }
});

module.exports = router;
