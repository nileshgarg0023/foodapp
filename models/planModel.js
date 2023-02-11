const mongoose = require("mongoose");
const db_link =
  "mongodb+srv://yourownusernameandpassword.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("plan db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: [20, "Plane name should not exceed more than 20 characters"],
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: [true, "Price not entered"],
  },
  ratingAverage: {
    type: Number,
  },
  discount: {
    type: Number,
    validate: [
      function () {
        return this.discount < 100;
      },
      "discount should not exceed price",
    ],
  },
});
const planModel = mongoose.model("planModel", planSchema);

// (async function createPlan() {
//   let planObj = {
//     name: "SuperFoodiz",
//     duration: 20,
//     price: 1000,
//     ratingAverage: 5,
//     discount: 15,
//   };
//   let data = await planModel.create(planObj);
//   console.log(data);
//   //   const doc = new planModel(planObj);
//   //   await doc.save();
// })();

// Model

module.exports = planModel;
