"use strict";

const express = require("express");
const multer = require("multer");
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const VideoFileFilter = (req, file, cb) => {
  if (file.mimetype.includes("video")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ dest: "./uploads/", imageFileFilter });
const router = express.Router();
const {
  news_list_get,
  news_get,
  news_post,
  news_delete,
  news_update_put,
  comment_post,
  comment_get_by_news_id,
  comment_delete_by_comment_id,
  comment_update_by_comment_id_put,
  favorite_news_post,
  user_favorite_news_list_get,
  favorite_by_id_delete,
  favorite_by_id_get,
  like_news_post,
  like_by_id_delete,
  liked_number_of_news_get,
  user_like_of_news_get,
  get_all_news_view_by_id,
  insert_news_view,
  paragraph_to_news_post,
  news_paragraph_get,
  news_category_list_get,
} = require("../controllers/newsController");
const { body } = require("express-validator");

router.route("/draft/:draft").get(news_list_get);
router.route("/search/category/:category").get(news_category_list_get);
router
  .route("/")
  .post(
    upload.single("newsPhoto"),
    body("title").notEmpty(),
    body("op").notEmpty(),
    body("content").notEmpty(),
    body("draft").notEmpty(),
    news_post
  );

router
  .route("/paragraph/:newsId") 
  .get(news_paragraph_get)
  .post(
    upload.single("paragraphPhoto"),
    body("photoDescription"),
    body("content"),
    body("type"),
    paragraph_to_news_post
  );

router
  .route("/:newsId")
  .get(news_get)
  .delete(news_delete)
  .put(body("title").notEmpty(), body("content").notEmpty(), news_update_put);

router.route("/comments/newsid/:newsId").get(comment_get_by_news_id);

router
  .route("/comments/commentid/:commentId")
  .delete(comment_delete_by_comment_id)
  .put(body("content").notEmpty(), comment_update_by_comment_id_put);

router
  .route("/comments/:newsId")
  .post(body("content").notEmpty(), comment_post);

router.route("/user/favorite").get(user_favorite_news_list_get);

router
  .route("/user/favorite/:favoriteId")
  .delete(favorite_by_id_delete)
  .get(favorite_by_id_get);

router.route("/favorite/:newsId").post(favorite_news_post);

router.route("/like/:newsId").get(user_like_of_news_get);

router
  .route("/user/like/:newsId")
  .post(like_news_post)
  .delete(like_by_id_delete)
  .get(liked_number_of_news_get);

router.route("/all/newsViews/:newsId").get(get_all_news_view_by_id);

router
  .route("/all/newsViews")
  .post(body("userId").notEmpty(), body("newsId").notEmpty(), insert_news_view);
module.exports = router;
