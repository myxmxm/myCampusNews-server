"use strict";
const pool = require("../database/db");
const { httpError } = require("../utils/errors");
const promisePool = pool.promise();

const getAllNews = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM news');
    return rows;
  } catch (e) {
    console.error("error", e.message);
  } 
};

const getNews = async (newsId, next) => {
  try {
  const [rows] = await promisePool.execute('SELECT * FROM news WHERE news_id = ?', [newsId]);
  console.log('Get by id result?', rows);
  return rows[0];
} catch (e) {
    console.error('model get news by id', e.message);
    const err = httpError('Sql error', 500);
    next(err);
  }
};

const insertNews = async (news) => {
  try {
    const [rows] = await promisePool.execute('INSERT INTO news (news_title, news_content, photoName) VALUES (?,?,?)',
        [news.title, news.content, news.photoName]);
      console.log('model insert news', rows);
      return rows.insertId;
  } catch (e) {
    console.error('model insert news', e.message);
  }
};

const deleteNews = async (newsId) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM news WHERE news_id = ?', [newsId]);
    console.log('model delete news', rows);
    return true;
  } catch (e) {
    console.error('model delete news', e.message);
  }
};

const updateNews = async (news, newId) => {
  try {
    const [rows] = await promisePool.execute('UPDATE news SET news_title = ?, news_content = ? WHERE news_id = ?',
    [news.title, news.content, newId]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('model update news', e.message);
  }
};

const insertComment = async (comment) => {
  try {
    const [rows] = await promisePool.execute('INSERT INTO news_comment (u_id, n_id, comment_content) VALUES (?,?,?)',
        [comment.userId, comment.newsId, comment.content]);
      console.log('model insert comment', rows);
      return rows.insertId;
  } catch (e) {
    console.error('model insert comment', e.message);
  }
};

const getAllCommentsByNewsId = async (newsId, next) => {
  try {
  const [rows] = await promisePool.execute('SELECT * FROM news_comment WHERE n_id = ?', [newsId]);
  console.log('Get comments by news id result', rows);
  return rows;
} catch (e) {
    console.error('model get comments by news id', e.message);
    const err = httpError('Sql error', 500);
    next(err);
  }
};

const deleteCommentByCommentId = async (commentId) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM news_comment WHERE comment_id = ?', [commentId]);
    console.log('model delete comment', rows);
    return true;
  } catch (e) {
    console.error('model delete comment', e.message);
  }
};

const updateCommentByCommentId = async (comment, commentId) => {
  try {
    const [rows] = await promisePool.execute('UPDATE news_comment SET comment_content = ? WHERE comment_id = ?',
    [comment, commentId]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('model update news comment', e.message);
  }
};


module.exports = {
    getAllNews,
    getNews,
    insertNews,
    deleteNews,
    updateNews,
    insertComment,
    getAllCommentsByNewsId,
    deleteCommentByCommentId,
    updateCommentByCommentId
  };