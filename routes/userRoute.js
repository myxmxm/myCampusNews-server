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
  user_info_get,
  user_info_update_put,
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

router.route("/avatar").put(upload.single("avatar"), user_avatar_update_put);

router
  .route("/update")
  .put(
    upload.single("avatar"),
    body("fullName").notEmpty(),
    body("email").isEmail(),
    body("contactNumber"),
    body("employeeNumber"), 
    body("departmentLocation"),  
    user_info_update_put);

router.route("/userid/:userId").get(user_get_by_id).delete(user_delete);

router
  .route("/password")
  .put(body("password").matches("(?=.*[A-Z]).{8,}"), user_password_update_put);

router.get("/token", user_info_get);

module.exports = router;
