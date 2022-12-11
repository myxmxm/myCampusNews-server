"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
//ser fileFilter for image file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//set image uploads folder
const upload = multer({ dest: "./uploads/", fileFilter });
//set validator for form data
const { body } = require("express-validator");
const {
  user_list_get,
  user_post,
  user_get_by_id,
  user_delete,
  user_password_update_put,
  user_avatar_update_put,
  user_info_get,
  user_info_update_put,
  user_role_update_put,
} = require("../controllers/userController");
//get list of users
//add new user
router
  .route("/")
  .get(user_list_get)
  .post(
    body("fullName").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").matches("(?=.*[A-Z]).{8,}"),
    user_post
  );
//change user avatar
router.route("/avatar").put(upload.single("avatar"), user_avatar_update_put);
//update user info
router
  .route("/update")
  .put(
    upload.single("avatar"),
    body("fullName").notEmpty(),
    body("email").isEmail(),
    body("contactNumber"),
    body("employeeNumber"),
    body("departmentLocation"),
    user_info_update_put
  );
//update user's privilege
router.route("/update/role/:userId").put(user_role_update_put);
//delete user by user id
router.route("/userid/:userId").get(user_get_by_id).delete(user_delete);
//change user's password
router
  .route("/password")
  .put(body("password").matches("(?=.*[A-Z]).{8,}"), user_password_update_put);
//get user's info by token
router.get("/token", user_info_get);

module.exports = router;
