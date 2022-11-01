"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ dest: "./uploads/", fileFilter });
const { body } = require("express-validator");
const {
  user_list_get,
  user_post,
  user_get_by_id,
  user_delete,
  user_password_update_put,
  user_avatar_update_put,
} = require("../controllers/userController");

router
  .route("/")
  .get(user_list_get)
  .post(
    body("fullName").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").matches("(?=.*[A-Z]).{8,}"),
    user_post
  );

router
  .route("/:userId")
  .get(user_get_by_id)
  .delete(user_delete)
  .put(upload.single("avatar"), user_avatar_update_put);

router
  .route("/password/:userId")
  .put(body("password").matches("(?=.*[A-Z]).{8,}"), user_password_update_put)

module.exports = router;
