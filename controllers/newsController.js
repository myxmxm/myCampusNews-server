"use strict";
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
  insertParagraphToNews,
  getParagraphOfNews,
  getNewsByCategory,
  updateNewsHighLighted,
} = require("../models/newsModel");
const { httpError } = require("../utils/errors");
const { validationResult } = require("express-validator");
// get all news
const news_list_get = async (req, res) => {
  const news = await getAllNews(req.params.draft);
  if (news.length > 0) {
    res.json(news);
  } else {
    res.json({ message: `News not found`, status: 409 });
    const err = httpError("News not found", 404);
  }
};
// get news with news Id
const news_get = async (req, res, next) => {
  const news = await getNews(req.params.newsId);
  if (!news) {
    const err = httpError(`News not found by id ${req.params.newsId}`, 404);
    next(err);
    return;
  }
  res.json(news);
};
// get news with specific category
const news_category_list_get = async (req, res) => {
  const news = await getNewsByCategory(req.params.category);
  if (news.length > 0) {
    res.json(news);
  } else {
    res.json({ message: `News by this category not found`, status: 409 });
  }
};
// post news with contents validation
const news_post = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("news_post validation", errors.array());
    const err = httpError("data not valid", 400);
    next(err);
    return;
  }

  const news = req.body;
  if (req.file) {
    news.photoName = req.file.filename;
  } else {
    news.photoName = "unavailable";
  }

  const id = await insertNews(news);
  res.json({ message: `${id}`, status: 200 });
};
// get all paragraphs of a news
const news_paragraph_get = async (req, res, next) => {
  const paragraph = await getParagraphOfNews(req.params.newsId);
  if (!paragraph) {
    const err = httpError(
      `Paragraph not found by news id ${req.params.newsId}`,
      404
    );
    next(err);
    return;
  }
  res.json(paragraph);
};
// add paragraph to news
const paragraph_to_news_post = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("paragraph_to_news_post validation", errors.array());
    const err = httpError("data not valid", 400);
    next(err);
    return;
  }

  const paragraph = req.body;
  if (req.file) {
    paragraph.photoName = req.file.filename;
  } else {
    paragraph.photoName = "unavailable";
  }
  console.log(req.params.newsId);
  console.log(paragraph);

  const id = await insertParagraphToNews(req.params.newsId, paragraph);
  res.json({
    message: `paragraph added to news ${req.params.newsId} with id: ${id}`,
    status: 200,
  });
};
// delete news
const news_delete = async (req, res, next) => {
  await deleteNews(req.params.newsId, next);
  let id = req.params.newsId;
  if (!id) {
    const err = httpError("Fail to delete news", 400);
    next(err);
    return;
  }
  res.json({ message: `News id ${req.params.newsId} deleted` });
};
// update news
const news_update_put = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("news_update_put validation", errors.array());
    const err = httpError("data not valid", 400);
    next(err);
    return;
  }
  req.body.id = req.params.newsId;
  const updated = await updateNews(req.body, req.params.newsId);
  res.json({ message: `News updated: ${updated}` });
};
// change highlight status of a news
const news_highlighted_update_put = async (req, res) => {
  try {
    const updated = await updateNewsHighLighted(
      req.body.highlighted,
      req.params.newsId
    );
    res.json({ message: `News hightlighted updated: ${updated}` });
  } catch (e) {
    console.log("news_highlighted_update_put", e.message);
    res.json({ message: e.message, status: 409 });
    return;
  }
};
// post comment
const comment_post = async (req, res, next) => {
  console.log(`nid:${req.params.newsId} and uid: ${req.params.userId}`);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("comment_post validation", errors.array());
    const err = httpError("data not valid", 400);
    next(err);
    return;
  }

  console.log("add comment data", req.body);
  const comment = req.params;
  comment.content = req.body.content;
  const id = await insertComment(req.user.user_id, comment);
  res.json({ message: `comment added with id: ${id}` });
};
// get comment by news id
const comment_get_by_news_id = async (req, res, next) => {
  const comments = await getAllCommentsByNewsId(req.params.newsId);
  if (comments.length > 0) {
    res.json(comments);
  } else {
    const err = httpError("comments not found", 404);
    next(err);
  }
};
// delete comment by comment id
const comment_delete_by_comment_id = async (req, res, next) => {
  await deleteCommentByCommentId(req.params.commentId, next);
  let id = req.params.commentId;
  if (!id) {
    const err = httpError("Fail to delete comment", 400);
    next(err);
    return;
  }
  res.json({ message: `Comment id ${req.params.commentId} deleted` });
};
// update comment by comment id
const comment_update_by_comment_id_put = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(
      "comment_by_comment_id_update_put validation",
      errors.array()
    );
    const err = httpError("data not valid", 400);
    next(err);
    return;
  }
  const updated = await updateCommentByCommentId(
    req.body.content,
    req.params.commentId
  );
  res.json({ message: `Comment updated: ${updated}` });
};
//add news to bookmark
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
//get all bookmarked news of user
const user_favorite_news_list_get = async (req, res) => {
  const favoriteNews = await getAllFavoriteNewsOfUser(req.user.user_id);
  console.log("user's all favorite news", favoriteNews);
  if (favoriteNews.length > 0) {
    res.json(favoriteNews);
  } else {
    res.json({ message: `Favorite news not found`, status: 409 });
  }
};
//remove news from bookmark list
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
  console.log("favorite by idd", favorite);
  favorite
    ? res.json({ favorite: favorite, status: 200 })
    : res.json({ message: `Favorite news not found`, status: 409 });
};
//thumb up the news
const like_news_post = async (req, res) => {
  console.log("user id", req.user.user_id);
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
//remove thumb up to a specific news
const like_by_id_delete = async (req, res) => {
  await deleteLikeByLikeId(req.params.newsId, req.user.user_id);
  res.json({ message: `You no longer like this news`, status: 200 });
};
//get the total number of thumbed up by users to a specific news
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
//add view number to a specific news
const insert_news_view = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("News view validation error", errors.array());
    const err = httpError("data not valid", 400);
    next(err);
    return;
  }
  await insertNewsView(req.body.userId, req.body.newsId);
  res.json({ status: 200 });
};
//get total number of view of specific news
const get_all_news_view_by_id = async (req, res, next) => {
  const news = await getAllNewsViewsById(req.params.newsId);
  if (news.length > 0) {
    res.json(news);
  } else {
    const err = httpError("News view not found", 404);
    next(err);
  }
};

module.exports = {
  news_list_get,
  news_get,
  news_category_list_get,
  news_post,
  news_paragraph_get,
  paragraph_to_news_post,
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
  news_highlighted_update_put,
};
