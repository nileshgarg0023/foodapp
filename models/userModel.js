const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const db_link =
  "mongodb+srv://yourownusernameandpassword.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    minLengths: 8,
    validate: function () {
      return this.confirmPassword == this.password;
    },
  },

  role: {
    type: String,
    enum: ["admin", "user", "restaurantowner", "deliveryboy"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: "img/users/default.jpg",
  },
  resetToken: String,
});

userSchema.pre("save", function () {
  this.confirmPassword = undefined;
});

// userSchema.pre("save", async function () {
//   let salt = await bcrypt.genSalt();
//   let hashedString = await bcrypt.hash(this.password, salt);
//   console.log(hashedString);
//   this.password = hashedString;
// });

//modal

userSchema.methods.createResetToken = function () {
  //creating unique token using crypto
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = resetToken;
  return resetToken;
};

userSchema.methods.resetpasswordHandler = function (password, confirmPassword) {
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.resetToken = undefined;
};

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;

// (async function createUser() {
//   let user = {
//     name: "Punu",
//     email: "abcd@gmail.com",
//     password: "12345678",
//     confirmPassword: "12345678",
//   };

//   let data = await userModel.create(user);
//   console.log(data);
// })();
