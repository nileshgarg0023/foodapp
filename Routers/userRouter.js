const express = require("express");
// const { filter } = require("lodash");
const multer = require("multer");

const userRouter = express.Router();

// const protectRoute = require("./authHelper");

const {
  signup,
  login,
  isAuthorised,
  protectRoute,
  logout,
  forgetpassword,
  resetpassword,
} = require("../controller/authController");

const {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  updateProfileImage,
} = require("../controller/userController");

//User options
userRouter.route("/:id").patch(updateUser).delete(deleteUser);

// User Registration
userRouter.route("/signup").post(signup);

userRouter.route("/login").post(login);

// Forget Password
userRouter.route("/forgetpassword").post(forgetpassword);

// Reset Password
userRouter.route("/resetpassword/:token").post(resetpassword);

// Logout user
userRouter.route("/logout").get(logout);

// multer for filestorage
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}.jpeg`);
  },
});

const filter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an Image! Please upload an image"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: filter,
});

userRouter.post("/ProfileImage", upload.single("photo"), updateProfileImage);
userRouter.get("/ProfileImage", (req, res) => {
  res.sendFile("/Users/Garg-pc/Desktop/NodeJsProjects/foodapp/mutler.html");
});
//Profile page
userRouter.use(protectRoute);

userRouter.route("/userProfile").get(getUser);
//Admin specific function
userRouter.use(isAuthorised(["admin"]));
userRouter.route("/").get(getAllUsers);

module.exports = userRouter;
