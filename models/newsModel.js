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


module.exports = {
    getAllNews,
    getNews,
    insertNews,
    deleteNews,
    updateNews
  };