const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { isLoggedIn } = require("./middlewares");
const router = express.Router();
const {
  like,
  dislike,
  postImg,
  post,
  deletepost,
} = require("../controllers/post");

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("creating uploads");
  fs.mkdirSync("uploads");
}

const uploadImg = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/like", isLoggedIn, like);

router.post("/dislike", isLoggedIn, dislike);

router.post("/img", isLoggedIn, uploadImg.single("img"), postImg);

const uploadText = multer();
router.post("/", isLoggedIn, uploadText.none(), post);

router.delete("/:id", isLoggedIn, uploadText.none(), deletepost);

module.exports = router;
