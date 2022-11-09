"use strict";
const pool = require("../database/db");
const { httpError } = require("../utils/errors");
const promisePool = pool.promise();

const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM user");
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
};

const getUserById = async (userId, next) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM user WHERE user_id = ?",
      [userId]
    );
    console.log("Get by user id result?", rows);
    return rows[0];
  } catch (e) {
    console.error("model get user by id", e.message);
    const err = httpError("Sql error", 500);
    next(err);
  }
};

const insertUser = async (user) => {
  try {
    const [rows] = await promisePool.execute(
      "INSERT INTO user (email, full_name, password, avatar_name) VALUES (?,?,?,?)",
      [user.email, user.fullName, user.password, "unavailable"]
    );
    console.log("model insert user", rows);
    return rows.insertId;
  } catch (e) {
    console.error("model insert user", e.message);
  }
};

const deleteUser = async (UserId) => {
  try {
    const [rows] = await promisePool.execute(
      "DELETE FROM user WHERE user_id = ?",
      [UserId]
    );
    console.log("model delete user", rows);
    return true;
  } catch (e) {
    console.error("model delete user", e.message);
  }
};

const updateUserPassword = async (user, UserId) => {
  try {
    const [rows] = await promisePool.execute(
      "UPDATE user SET password = ? WHERE user_id = ?",
      [user.password, UserId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error("model update user password", e.message);
  }
};

const updateUserAvatar = async (avatar, UserId) => {
  try {
    const [rows] = await promisePool.execute(
      "UPDATE user SET avatar_name = ? WHERE user_id = ?",
      [avatar, UserId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error("model update user password", e.message);
  }
};

const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
      "SELECT * FROM user WHERE email = ?;",
      params
    );
    return rows;
  } catch (e) {
    console.log("error", e.message);
  }
};

const updateUserInfo = async (user, avatar, UserId) => {
  try {
    const [rows] = await promisePool.execute(
      "UPDATE user SET email = ?, full_name = ?, contact_n = ?, employee_n = ?, department_l = ?, avatar_name = ? WHERE user_id = ?",
      [user.email, user.fullName, user.contactNumber, user.employeeNumber, user.departmentLocation, avatar, UserId]
    );
    return rows.affectedRows === 1;
  } catch (e) {
    console.error("model update user info", e.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  insertUser,
  deleteUser,
  updateUserPassword,
  updateUserAvatar,
  getUserLogin,
  updateUserInfo
};
