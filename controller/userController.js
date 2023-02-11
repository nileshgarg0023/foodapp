const { json } = require("express");
const lodash = require("lodash");
const userModel = require("../models/userModel");

module.exports.getUser = async function getUser(req, res) {
  // res.send(user);
  try {
    let id = req.id;
    let users = await userModel.findById(id);
    if (users) {
      res.json(users);
    } else {
      console.log("User not found");
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// module.exports.postUser = function postUser(req, res) {
//   console.log(req.body);
//   users = req.body;
//   res.json({
//     message: "data received successfully",
//     user: req.body,
//   });
// };

module.exports.updateUser = async function updateUser(req, res) {
  try {
    // console.log("request.body->", req.body);
    let id = req.params.id;
    let user = await userModel.findById(id);
    let dataToBeUpdated = req.body;
    if (user) {
      const keys = [];
      for (let key in dataToBeUpdated) {
        keys.push(key);
      }

      for (let i = 0; i < keys.length; i++) {
        user[keys[i]] = dataToBeUpdated[keys[i]];
      }
      const updatedData = await user.save();
      res.json({
        message: "Data updated successfully",
        data: user,
      });
    } else {
      res.json({
        message: "User not found",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.deleteUser = async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findByIdAndDelete(id);

    if (!user) {
      res.json({
        message: "user not found",
      });
    } else {
      res.json({
        message: "Data deleted successfully",
        data: user,
      });
    }
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

module.exports.getAllUsers = async function getAllUsers(req, res) {
  let users = await userModel.find();
  try {
    if (users) {
      res.json({
        message: "users retrieved",
        data: users,
      });
    } else {
      return json({
        message: "user not found",
      });
    }
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

module.exports.updateProfileImage = function updateProfileImage(req, res) {
  res.json({
    message: "file uploaded sucessfully",
  });
};
