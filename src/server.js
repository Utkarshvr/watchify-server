require("dotenv").config();
// const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const passport = require("passport");

const mongoose = require("mongoose");
const connectToDB = require("./config/connectToDB");
const corsOptions = require("./config/corsOptions");
const rootRoute = require("./routes/root");

const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 8080;

connectToDB();

console.log({ secure: process.env.IN_DEVELOPMENT !== "YES" });

if (process.env.IN_DEVELOPMENT !== "YES") {
  app.set("trust proxy", 1); // trust first proxy
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  session({
    secret: "your_secret_key",
    resave: false, // Avoid unnecessary session store writes
    saveUninitialized: false, // Avoid storing uninitialized sessions
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days in milliseconds
      path: "/",
      sameSite: "none",
      secure: process.env.IN_DEVELOPMENT !== "YES",
      httpOnly: true,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

require("./passport");
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  console.log({ passport_user: req?.session.passport?.user });
  res.status(200).json({ msg: "Welcome to Watchify API" });
});

// Routes
app.use("/api", rootRoute);

app.all("*", (req, res) => {
  res.status(404).json({ message: "404 ROUTE NOT FOUND" });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(port, () => console.log(`Listenting on port ${port}...`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

module.exports = app;
