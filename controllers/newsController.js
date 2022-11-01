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
} = require("../models/newsModel");
const { httpError } = require("../utils/errors");
const { validationResult } = require("express-validator");

const news_list_get = async (req, res) => {
  const news = await getAllNews();
  console.log("all news", news);
  if (news.length > 0) {
    res.json(news);
  } else {
    const err = httpError("News not found", 404);
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
    console.error("news_post validation", errors.array());
    const err = httpError("data not valid", 400);
    next(err);
    return;
  }

  console.log("add news data", req.body);
  console.log("news photo name", req.file);

  if (!req.file) {
    const err = httpError("Invalid file", 400);
    next(err);
    return;
  }
  const news = req.body;
  news.photoName = req.file.filename;
  const id = await insertNews(news);
  res.json({ message: `news added with id: ${id}` });
};

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
  const id = await insertComment(comment);
  res.json({ message: `comment added with id: ${id}` });
};

const comment_get_by_news_id = async (req, res, next) => {
  const comments = await getAllCommentsByNewsId(req.params.newsId);
  if (comments.length > 0) {
    res.json(comments);
  } else {
    const err = httpError("comments not found", 404);
    next(err);
  }
};

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

const comment_update_by_comment_id_put = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("comment_by_comment_id_update_put validation", errors.array());
    const err = httpError("data not valid", 400);
    next(err);
    return;
  }
//   req.body.id = req.params.newsId;
  const updated = await updateCommentByCommentId(req.body.content, req.params.commentId);
  res.json({ message: `Comment updated: ${updated}` });
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
  comment_update_by_comment_id_put
};
