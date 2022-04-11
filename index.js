const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 4000;

const noteRoutes = require("./notes/routes");
const userRoutes = require("./users/routes");

const { username, password } = process.env;

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.z9edb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/notes", noteRoutes);
app.use("/users", userRoutes);
app.listen(PORT, () => {
  console.log(`The app is running`);
});
