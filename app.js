const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");

dotenv.config({ path: "./config.env" });
require("./db/conn");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.json());

const survey = require("./controller/survey");
app.use("/api/survey", survey);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port no ${PORT}`);
});
