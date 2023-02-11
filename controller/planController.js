const planModel = require("../models/planModel");

module.exports.getAllPlans = async function getAllPlans(req, res) {
  try {
    let plans = await planModel.find();
    if (plans) {
      return res.json({
        message: "all plans retrived",
        data: plans,
      });
    } else {
      return res.json({
        message: "plans not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.getPlan = async function getPlan(req, res) {
  try {
    let id = req.params.id;
    let plan = await planModel.findById(id);
    if (plan) {
      return res.json({
        message: "plan retrived",
        data: plan,
      });
    } else {
      return res.json({
        message: "plan not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.createPlan = async function createPlan(req, res) {
  try {
    let planData = req.body;
    let createdPlan = await planModel.create(planData);
    return res.json({
      message: "plan created",
      data: createdPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.updatePlan = async function updatePlan(req, res) {
  try {
    let id = req.params.id;
    let dataToBeUpdated = req.body;
    let keys = [];
    for (const key in dataToBeUpdated) {
      keys.push(key);
    }
    let plan = await planModel.findById(id);
    for (let i = 0; i < keys.length; i++) {
      plan[keys[i]] = dataToBeUpdated[keys[i]];
    }
    await plan.save();
    return res.json({
      message: "data updated sucessfully",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.deletePlan = async function deletePlan(req, res) {
  try {
    let id = req.params.id;
    let deletedPlan = await planModel.findByIdAndDelete(id);
    return res.json({
      message: "plan deleted",
      data: deletedPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// get top3 plans

module.exports.top3Plans = async function top3Plans(req, res) {
  try {
    const plans = await planModel
      .find()
      .sort({
        ratingAverage: -1,
      })
      .limit(3);
    return res.json({
      message: "top 3 plans",
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
