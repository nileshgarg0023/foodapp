const { json } = require("express");
const lodash = require("lodash");
const reviewModel = require("../models/reviewModel");
const planModel = require("../models/planModel");

module.exports.getAllReviews = async function getAllReviews(req, res) {
  try {
    const reviews = await reviewModel.find();
    if (reviews) {
      return res.json({
        message: "review retrieved",
        data: reviews,
      });
    } else {
      return res.json({
        message: "review not found",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports.top3reviews = async function top3reviews(req, res) {
  try {
    const reviews = await reviewModel
      .find()
      .sort({
        rating: -1,
      })
      .limit(3);
    if (reviews) {
      return res.json({
        message: "review retrieved",
        data: reviews,
      });
    } else {
      return res.json({
        message: "review not found",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
module.exports.getPlanReviews = async function getPlanReviews(req, res) {
  try {
    let planId = req.params.id;
    let reviews = await reviewModel.find();
    reviews = reviews.filter((review) => review.plan._id == planId);
    if (reviews) {
      return res.json({
        message: "review retrieved",
        data: reviews,
      });
    } else {
      return res.json({
        message: "review not found",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports.createReview = async function createReview(req, res) {
  try {
    let id = req.params.plan;
    let plan = await planModel.findById(id);
    let review = await reviewModel.create(req.body);
    plan.ratingAverage = plan.ratingAverage + req.body.rating / 2;
    await plan.save();
    res.json({
      message: "review created sucessfully",
      data: review,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports.updateReview = async function updateReview(req, res) {
  try {
    let planId = req.params.id;

    // review id from frontend
    let id = req.body.id;
    let review = await reviewModel.findById(id);

    let dataToBeUpdated = req.body;
    let keys = [];
    for (const key in dataToBeUpdated) {
      if (key == "id") continue;
      keys.push(key);
    }
    for (let i = 0; i < keys.length; i++) {
      review[keys[i]] = dataToBeUpdated[keys[i]];
    }
    await review.save();
    return res.json({
      message: "data updated sucessfully",
      data: review,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports.deleteReview = async function deleteReview(req, res) {
  try {
    let planId = req.params.id;

    // review id from frontend
    let id = req.body.id;
    let review = await reviewModel.findByIdAndDelete(id);
    res.json({
      message: "review deleted sucessfully",
      data: review,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
