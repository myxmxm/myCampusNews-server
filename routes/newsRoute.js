'use strict';

const express = require('express');
const multer = require('multer');
//set file filter for image
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//set file filter for video
const VideoFileFilter = (req, file, cb) => {
  if (file.mimetype.includes('video')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//set destination folder for uploaded image or video
const upload = multer({ dest: './uploads/', imageFileFilter });
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
  news_highlighted_update_put,
} = require('../controllers/newsController');
const { body } = require('express-validator');
//get news list
router.route('/draft/:draft').get(news_list_get);
//get news by category
router.route('/search/category/:category').get(news_category_list_get);
//post news with mandatory cover image
router
  .route('/')
  .post(
    upload.single('newsPhoto'),
    body('news_title').notEmpty(),
    body('news_op').notEmpty(),
    body('news_content').notEmpty(),
    body('draft').notEmpty(),
    news_post
  );
//get extra paragraph of a news 
//post extra paragraph to a news
router
  .route('/paragraph/:newsId')
  .get(news_paragraph_get)
  .post(
    upload.single('paragraphPhoto'),
    body('photoDescription'), 
    body('content'), 
    body('type'),
    paragraph_to_news_post
  );
//update highlight status of news
router.route('/highlighted/:newsId').put(news_highlighted_update_put);
//get news by news id
//delete news by news id
//update news by news id
router
  .route('/:newsId')
  .get(news_get)
  .delete(news_delete)
  .put(body('title').notEmpty(), body('content').notEmpty(), news_update_put);
//get all comments of a news by news id
router.route('/comments/newsid/:newsId').get(comment_get_by_news_id);
//delete comment by comment id
//update comment by comment id
router
  .route('/comments/commentid/:commentId')
  .delete(comment_delete_by_comment_id)
  .put(body('content').notEmpty(), comment_update_by_comment_id_put);
//post comment with news id
router
  .route('/comments/:newsId')
  .post(body('content').notEmpty(), comment_post);
//get user's bookmark list 
router.route('/user/favorite').get(user_favorite_news_list_get);
//delete a news from bookmark list 
//get bookmark by bookmark id
router
  .route('/user/favorite/:favoriteId')
  .delete(favorite_by_id_delete)
  .get(favorite_by_id_get);
//add news to user's bookmark list
router.route('/favorite/:newsId').post(favorite_news_post);
//get news list which have been liked by user
router.route('/like/:newsId').get(user_like_of_news_get);
//add like to a news
//delete like to a news
//get number of like of a news
router
  .route('/user/like/:newsId')
  .post(like_news_post)
  .delete(like_by_id_delete)
  .get(liked_number_of_news_get);
//get number of view of a news
router.route('/all/newsViews/:newsId').get(get_all_news_view_by_id);
//add view number to a news
router
  .route('/all/newsViews')
  .post(body('userId').notEmpty(), body('newsId').notEmpty(), insert_news_view);
module.exports = router;
