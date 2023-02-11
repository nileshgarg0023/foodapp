const express = require("express");
const planRouter = express.Router();
const { protectRoute, isAuthorised } = require("../controller/authController");
const {
  getPlan,
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
} = require("../controller/planController");
// All plans
planRouter.route("/allPlans").get(getAllPlans);

// Own plans
planRouter.use(protectRoute);
planRouter.route("/plan/:id").get(getPlan);

// Authrorization for crud operations
planRouter.use(isAuthorised(["admin", "restaurantowner"]));

//Plan Crud operations
planRouter.route("/crudPlan").post(createPlan);
planRouter.route("/crudPlan/:id").patch(updatePlan).delete(deletePlan);

module.exports = planRouter;
