"use strict";

const express = require("express");
const multer = require("multer");
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ dest: "./uploads/", fileFilter });
const router = express.Router();
const {
  news_list_get,
  news_get,
  news_post,
  news_delete,
  news_update_put,
} = require("../controllers/newsController");
const { body } = require("express-validator");

router.route("/")
  .get(news_list_get)
  .post(
    upload.single("newsPhoto"),
    body("title").notEmpty(),
    body("content").notEmpty(),
    news_post)

router.route("/:newsId")
  .get(news_get)
  .delete(news_delete)
  .put(
    body("title").notEmpty(),
    body("content").notEmpty(),
    news_update_put)

module.exports = router;
