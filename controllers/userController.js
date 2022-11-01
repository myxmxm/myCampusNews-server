"use strict";
const { httpError } = require("../utils/errors");
const { validationResult } = require("express-validator");
const { makeThumbnail } = require("../utils/resize");
const {
  getAllUsers,
  getUserById,
  insertUser,
  deleteUser,
  updateUserPassword,
  updateUserAvatar,
} = require("../models/userModel");

const user_list_get = async (req, res) => {
  const users = await getAllUsers();
  users.map((user) => {
    delete user.password;
  });
  console.log("all users", users);
  res.json(users);
};

const user_get_by_id = async (req, res, next) => {
  const user = await getUserById(req.params.userId);
  if (!user) {
    const err = httpError(`Users not found by id ${req.params.userId}`, 404);
    next(err);
    return;
  }
  delete user.password;
  res.json(user);
};

const user_post = async (req, res, next) => {
  console.log("add user data", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("user_post validation", errors.array());
    const err = httpError("data not valid", 400);
    next(err);
    return;
  }
  const user = req.body;
  const uid = await insertUser(user);
  res.json({ message: `user added with id: ${uid}` });
};

const user_delete = async (req, res) => {
  await deleteUser(req.params.userId);
  res.json({ message: `User deleted: ${req.params.userId}` });
};

const user_password_update_put = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("user_password_update_put validation", errors.array());
    const err = httpError("data not valid", 400);
    next(err);
    return;
  }
  const updated = await updateUserPassword(req.body, req.params.userId);
  res.json({ message: `User password updated ${updated}` });
};

const user_avatar_update_put = async (req, res, next) => {
  if (!req.file) {
    const err = httpError("Invalid file", 400);
    next(err);
    return;
  }
  try {
    const avatar = await makeThumbnail(req.file.path, req.file.filename);

    if (avatar) {
      const updated = await updateUserAvatar(
        req.file.filename,
        req.params.userId
      );
      res.json({ message: `User avatar updated ${updated}` });
      console.log(`user avatar updated with avatar name ${req.file.filename}`);
    }
  } catch (e) {
    console.log("user_avatar_update_put", e.message);
    const err = httpError("Invalid file", 400);
    next(err);
    return;
  }
};

const checkToken = (req, res, next) => {
    console.log('checkToken', req.user);
    if (!req.user) {
      next(httpError('token not valid', 400));
    } else {
      res.json({ user: req.user });
    }
  };

module.exports = {
  user_list_get,
  user_get_by_id,
  user_post,
  user_delete,
  user_password_update_put,
  user_avatar_update_put,
  checkToken
};
