const { Post, Hashtag } = require("../models");
const cache = require("../passport/cache");

exports.like = async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.body.id } });
    if (post) {
      const result = await post.addLikes(req.user.id);
      cache.setDirty(req.user.id);
      res.send("success");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.dislike = async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.body.id } });
    if (post) {
      const result = await post.removeLikes(req.user.id);
      cache.setDirty(req.user.id);
      res.send("success");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.postImg = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

exports.post = async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.deletepost = async (req, res, next) => {
  try {
    const result = await Post.destroy({
      where: { id: req.params.id },
    });
    if (result == 1) res.send("success");
    else res.status(404).send("no twit");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
