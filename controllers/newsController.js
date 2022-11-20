'use strict';
const {
  getAllNews,
  getNews,
  insertNews,
  deleteNews,
  updateNews,
  insertComment,
  getAllCommentsByNewsId,
  deleteCommentByCommentId,
  updateCommentByCommentId,
  insertFavoriteNews,
  getAllFavoriteNewsOfUser,
  deleteFavoriteByFavoriteId,
  getFavoriteById,
  getAllLikedNewsOfUser,
  insertLikeNews,
  deleteLikeByLikeId,
  getNumberOfLikeByNewsId,
  getUserLikeOfOneNews,
  getAllNewsViewsById,
  insertNewsView,
} = require('../models/newsModel');
const { httpError } = require('../utils/errors');
const { validationResult } = require('express-validator');

const news_list_get = async (req, res) => {
  const news = await getAllNews(req.params.draft);
  //console.log('all news', news);
  if (news.length > 0) {
    res.json(news);
  } else {
    const err = httpError('News not found', 404);
  }
};

const news_get = async (req, res, next) => {
  const news = await getNews(req.params.newsId);
  if (!news) {
    const err = httpError(`News not found by id ${req.params.newsId}`, 404);
    next(err);
    return;
  }
  res.json(news);
};

const news_post = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('news_post validation', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }

  console.log('add news data', req.body);
  console.log('news photo name', req.file);

  if (!req.file) {
    const err = httpError('Invalid file', 400);
    next(err);
    return;
  }
  const news = req.body;
  news.photoName = req.file.filename;
  const id = await insertNews(news);
  res.json({ message: `news added with id: ${id}`, status: 200 });
};

const news_delete = async (req, res, next) => {
  await deleteNews(req.params.newsId, next);
  let id = req.params.newsId;
  if (!id) {
    const err = httpError('Fail to delete news', 400);
    next(err);
    return;
  }
  res.json({ message: `News id ${req.params.newsId} deleted` });
};

const news_update_put = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('news_update_put validation', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }
  req.body.id = req.params.newsId;
  const updated = await updateNews(req.body, req.params.newsId);
  res.json({ message: `News updated: ${updated}` });
};

const comment_post = async (req, res, next) => {
  console.log(`nid:${req.params.newsId} and uid: ${req.params.userId}`);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('comment_post validation', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }

  console.log('add comment data', req.body);
  const comment = req.params;
  comment.content = req.body.content;
  const id = await insertComment(req.user.user_id, comment);
  res.json({ message: `comment added with id: ${id}` });
};

const comment_get_by_news_id = async (req, res, next) => {
  const comments = await getAllCommentsByNewsId(req.params.newsId);
  if (comments.length > 0) {
    res.json(comments);
  } else {
    const err = httpError('comments not found', 404);
    next(err);
  }
};

const comment_delete_by_comment_id = async (req, res, next) => {
  await deleteCommentByCommentId(req.params.commentId, next);
  let id = req.params.commentId;
  if (!id) {
    const err = httpError('Fail to delete comment', 400);
    next(err);
    return;
  }
  res.json({ message: `Comment id ${req.params.commentId} deleted` });
};

const comment_update_by_comment_id_put = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(
      'comment_by_comment_id_update_put validation',
      errors.array()
    );
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }
  //   req.body.id = req.params.newsId;
  const updated = await updateCommentByCommentId(
    req.body.content,
    req.params.commentId
  );
  res.json({ message: `Comment updated: ${updated}` });
};

const favorite_news_post = async (req, res) => {
  const favoriteNews = await getAllFavoriteNewsOfUser(req.user.user_id);
  var saveFavorite = true;
  favoriteNews.forEach((favorite) => {
    if (favorite.favorite_news_id == req.params.newsId) {
      saveFavorite = false;
    }
  });
  if (saveFavorite) {
    const id = await insertFavoriteNews(req.params.newsId, req.user.user_id);
    res.json({
      message: `This news has been added to your favorite list`,
      status: 200,
    });
  } else {
    res.json({
      message: `This news is already in your favorite list`,
      status: 409,
    });
  }
};

const user_favorite_news_list_get = async (req, res) => {
  const favoriteNews = await getAllFavoriteNewsOfUser(req.user.user_id);
  console.log("user's all favorite news", favoriteNews);
  if (favoriteNews.length > 0) {
    res.json(favoriteNews);
  } else {
    res.json({ message: `Favorite news not found`, status: 409 });
  }
};

const favorite_by_id_delete = async (req, res) => {
  await deleteFavoriteByFavoriteId(req.params.favoriteId);
  res.json({
    message: `This news has been removed from your favorite list`,
    status: 200,
  });
};

const favorite_by_id_get = async (req, res, next) => {
  const favorite = await getFavoriteById(
    req.params.favoriteId,
    req.user.user_id
  );
  console.log('favorite by idd', favorite);
  favorite
    ? res.json({ favorite: favorite, status: 200 })
    : res.json({ message: `Favorite news not found`, status: 409 });
};

const like_news_post = async (req, res) => {
  console.log('user id', req.user.user_id);
  const likedNews = await getAllLikedNewsOfUser(req.user.user_id);
  var saveLiked = true;
  likedNews.forEach((liked) => {
    if (liked.n_id == req.params.newsId) {
      saveLiked = false;
    }
  });
  if (saveLiked) {
    await insertLikeNews(req.params.newsId, req.user.user_id);
    res.json({ message: `You have liked this news`, status: 200 });
  } else {
    res.json({ message: `You have already liked this news`, status: 409 });
  }
};

const like_by_id_delete = async (req, res) => {
  await deleteLikeByLikeId(req.params.newsId, req.user.user_id);
  res.json({ message: `You no longer like this news`, status: 200 });
};

const liked_number_of_news_get = async (req, res) => {
  const likedListOfNews = await getNumberOfLikeByNewsId(req.params.newsId);
  res.json(likedListOfNews);
};

const user_like_of_news_get = async (req, res) => {
  const like = await getUserLikeOfOneNews(req.params.newsId, req.user.user_id);
  if (like.length > 0) {
    res.json(like);
  } else {
    res.json({ message: `User like not found`, status: 409 });
  }
};

const insert_news_view = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('News view validation error', errors.array());
    const err = httpError('data not valid', 400);
    next(err);
    return;
  }
  await insertNewsView(req.body.userId, req.body.newsId);
};

const get_all_news_view_by_id = async (req, res, next) => {
  const news = await getAllNewsViewsById(req.params.newsId);
  if (news.length > 0) {
    res.json(news);
  } else {
    const err = httpError('News view not found', 404);
    next(err);
  }
};

module.exports = {
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
  insert_news_view,
  get_all_news_view_by_id,
};
