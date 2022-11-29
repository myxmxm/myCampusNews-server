'use strict';
const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllNews = async (draft) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM news WHERE is_draft=?',
      [draft]
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const getNews = async (newsId, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM news WHERE news_id = ?',
      [newsId]
    );
    console.log('Get by id result?', rows);
    return rows[0];
  } catch (e) {
    console.error('model get news by id', e.message);
    const err = httpError('Sql error', 500);
    next(err);
  }
};

const getNewsByCategory = async (category, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM news WHERE category = ? AND is_draft != 1',
      [category]
    );
    console.log('Get by category result?', rows);
    return rows;
  } catch (e) {
    console.error('model get news by category', e.message);
    const err = httpError('Sql error', 500);
    next(err);
  }
};

const insertNews = async (news) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO news (news_title, news_op, news_content, photoName, is_draft, category) VALUES (?,?,?,?,?,?)',
      [news.title, news.op, news.content, news.photoName, news.draft, news.category]
    );
    console.log('model insert news', rows);
    return rows.insertId;
  } catch (e) {
    console.error('model insert news', e.message);
  }
};

const getParagraphOfNews = async (newsId, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM news_paragraph WHERE n_id = ?',
      [newsId]
    );
    console.log('Get news paragraph by id result?', rows);
    return rows;
  } catch (e) {
    console.error('model get news by id', e.message);
    const err = httpError('Sql error', 500);
    next(err);
  }
};

const insertParagraphToNews = async (newsId, paragraph) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO news_paragraph (n_id, p_photo_name, p_photo_description, p_content, m_type) VALUES (?,?,?,?,?)',
      [newsId, paragraph.photoName, paragraph.photoDescription, paragraph.content, paragraph.type]
    );
    console.log('model insert paragraph to news', rows);
    return rows.insertId;
  } catch (e) {
    console.error('model insert paragraph to news', e.message);
  }
};
 
const deleteNews = async (newsId) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM news WHERE news_id = ?',
      [newsId]
    );
    console.log('model delete news', rows);
    return true;
  } catch (e) {
    console.error('model delete news', e.message);
  }
};

const updateNews = async (news, newId) => {
  try {
    const [rows] = await promisePool.execute(
      'UPDATE news SET news_title = ?, news_content = ? WHERE news_id = ?',
      [news.title, news.content, newId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('model update news', e.message);
  }
};

const insertComment = async (userId, comment) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO news_comment (u_id, n_id, comment_content) VALUES (?,?,?)',
      [userId, comment.newsId, comment.content]
    );
    console.log('model insert comment', rows);
    return rows.insertId;
  } catch (e) {
    console.error('model insert comment', e.message);
  }
};

const getAllCommentsByNewsId = async (newsId, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM news_comment WHERE n_id = ?',
      [newsId]
    );
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
    const [rows] = await promisePool.execute(
      'DELETE FROM news_comment WHERE comment_id = ?',
      [commentId]
    );
    console.log('model delete comment', rows);
    return true;
  } catch (e) {
    console.error('model delete comment', e.message);
  }
};

const updateCommentByCommentId = async (comment, commentId) => {
  try {
    const [rows] = await promisePool.execute(
      'UPDATE news_comment SET comment_content = ? WHERE comment_id = ?',
      [comment, commentId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('model update news comment', e.message);
  }
};

const insertFavoriteNews = async (newsId, userId) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO news_favorite(favorite_user_id, favorite_news_id) VALUES (?,?)',
      [userId, newsId]
    );
    console.log('model insert favorite news', rows);
    return rows.insertId;
  } catch (e) {
    console.error('model insert favorite news', e.message);
  }
};

const getAllFavoriteNewsOfUser = async (userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM news_favorite WHERE favorite_user_id = ?',
      [userId]
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const deleteFavoriteByFavoriteId = async (favoriteId) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM news_favorite WHERE favorite_news_id = ?',
      [favoriteId]
    );
    console.log('model delete favorite news', rows);
    return true;
  } catch (e) {
    console.error('model delete favirite news', e.message);
  }
};

const getFavoriteById = async (favoriteId, userId, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM news_favorite WHERE favorite_news_id = ? AND favorite_user_id = ?',
      [favoriteId, userId]
    );
    console.log('Get by id result?', rows);
    return rows[0];
  } catch (e) {
    console.error('model get news by id', e.message);
    const err = httpError('Sql error', 500);
    next(err);
  }
};

const insertLikeNews = async (newsId, userId) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO news_like(u_id, n_id) VALUES (?,?)',
      [userId, newsId]
    );
    console.log('model insert like news', rows);
    return rows.insertId;
  } catch (e) {
    console.error('model insert like news', e.message);
  }
};

const deleteLikeByLikeId = async (LikeId, userId) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM news_like WHERE n_id = ? AND u_id = ?',
      [LikeId, userId]
    );
    console.log('model delete like news', rows);
    return true;
  } catch (e) {
    console.error('model delete like news', e.message);
  }
};

const getNumberOfLikeByNewsId = async (newsId, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT COUNT(like_id) as "like" FROM news_like WHERE n_id = ?',
      [newsId]
    );
    console.log('Get by id result?', rows);
    return rows[0];
  } catch (e) {
    console.error('model get liked by id', e.message);
    const err = httpError('Sql error', 500);
    next(err);
  }
};

const getAllLikedNewsOfUser = async (userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM news_like WHERE u_id = ?',
      [userId]
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const getUserLikeOfOneNews = async (newsId, userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM news_like WHERE n_id = ? AND u_id =?',
      [newsId, userId]
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const insertNewsView = async (userId, newsId) => {
  let userExist = false;
  try {
    const [allNewsView] = await promisePool.query('SELECT * FROM news_view');
    allNewsView.map((view) => {
      if (view.user_id == userId && view.news_id == newsId) {
        userExist = true;
      }
    });
    if (userExist) {
      return;
    }
    const [rows] = await promisePool.execute(
      `INSERT INTO news_view(user_id, news_id) VALUES (?,?)`,
      [userId, newsId]
    );
    console.log('model insert favorite news', rows);
    return rows;
  } catch (e) {
    console.error('model insert favorite news', e.message);
  }
};

const getAllNewsViewsById = async (newsId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT news_id, COUNT(news_id = ?) as count FROM news_view where news_id = ?',
      [newsId, newsId]
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

module.exports = {
  getAllNews,
  getNews,
  getNewsByCategory,
  insertNews,
  getParagraphOfNews,
  insertParagraphToNews,
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
  insertLikeNews,
  deleteLikeByLikeId,
  getNumberOfLikeByNewsId,
  getAllLikedNewsOfUser,
  getUserLikeOfOneNews,
  insertNewsView,
  getAllNewsViewsById,
};
