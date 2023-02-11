const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utility/nodemailer");
const login_Key = require("../secrets");

// To signup the user
module.exports.signup = async function signup(req, res) {
  try {
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    sendMail("signup", user);
    if (user) {
      return res.json({
        message: "user signed up",
        data: user,
      });
    } else {
      res.json({
        message: "error",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// To login the user
module.exports.login = async function loginUser(req, res) {
  try {
    let data = req.body;
    if (data.email) {
      let user = await userModel.findOne({ email: data.email });

      if (user) {
        if (user.password == data.password) {
          let uid = user["_id"]; //uid
          let jwt_token = jwt.sign({ payLoad: uid }, login_Key.JWT_KEY);
          res.cookie("login", jwt_token, { httpOnly: true });
          return res.json({
            message: "user has logged in",
            userDetails: data,
          });
        } else {
          return res.json({
            message: "Wrong password",
          });
        }
      } else {
        return res.json({
          message: "User not found",
        });
      }
    } else {
      return res.json({
        message: "user not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//isAuthorised to check the user's role [resturantowner,deliveryboy]

module.exports.isAuthorised = function isAuthorised(roles) {
  return function (req, res, next) {
    if (roles.includes(req.role) == true) {
      next();
    } else {
      res.status(401).json({
        message: "operation not allowed",
      });
    }
  };
};

// Protect route

module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    let token;
    if (req.cookies.login) {
      // console.log(req.cookies);
      token = req.cookies.login;
      let payload = jwt.verify(token, login_Key.JWT_KEY);
      if (payload) {
        // console.log(payload);
        const user = await userModel.findById(payload.payLoad);
        // console.log(user);
        req.role = user.role;
        req.id = user.id;
        next();
      } else {
        return res.json({
          message: "User not verified",
        });
      }
    } else {
      const client = req.get("User-Agent");
      if (client.includes("Mozilla") == true) {
        return res.redirect("/login");
      } else {
        res.json({
          message: "please login",
        });
      }
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

// Forget password
module.exports.forgetpassword = async function forgetpassword() {
  let { email } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const resetToken = user.createResetToken();
      // http://abc.com/resetpassword/resetToken
      let resetPasswordLink = `${req.protocol}://${req.get(
        "host"
      )}/resetpassword/${resetToken}`;
      let obj = {
        resetPasswordLink: resetPasswordLink,
        email: email,
      };
      sendMail("resetpassword", obj);
      return res.json({
        message: "Please check your mail for reset link",
        data: obj,
      });
    } else {
      return res.json({
        message: "please signup",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// resetPassword

module.exports.resetpassword = async function resetpassword() {
  try {
    const token = req.params.token;
    let { password, confirmPassword } = req.body;
    const user = await userModel.findOne({ resetToken: token });
    if (user) {
      // resetPasswordHandler will update password in db
      user.resetpasswordHandler(password, confirmPassword);
      await user.save();

      res.json({
        message: "user password reset sucessfully please login again",
      });
    } else {
      return res.json({
        message: "user not found",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// Logout method

module.exports.logout = function logout(req, res) {
  res.cookie("login", " ", { maxAge: 1 });
  res.json({
    message: "user logged out succesfully",
  });
};
