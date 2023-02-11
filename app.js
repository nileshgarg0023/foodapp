const express = require("express");
const lodash = require("lodash");
const userRouter = require("./Routers/userRouter");
// const planModel = require("./models/planModel");
const planRouter = require("./Routers/planRouter");
const reviewRouter = require("./Routers/reviewRouter");
// const authRouter = require("./Routers/authRouter");
const cookieParser = require("cookie-parser");
const app = express();

//middleware func -> post,
app.use(express.json());
app.use(cookieParser());
const port = 3000;

app.listen(port);

app.use("/users", userRouter);
app.use("/plans", planRouter);
app.use("/reviews", reviewRouter);
// app.use("/auth", authRouter);
