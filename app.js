const express = require("express");
const dotenv = require("dotenv");
const app = express();
const axios = require("axios");
// const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config({ path: "./config.env" });
require("./db/conn");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
// app.use(cors());
app.use(express.json());

const survey = require("./controller/survey");
app.use("/api/survey", survey);

// axios
//   .get("https://jsonplaceholder.typicode.com/users")
//   .then((res) => {
//     const headerDate =
//       res.headers && res.headers.date ? res.headers.date : "no response date";
//     console.log("Status Code:", res.status);
//     console.log("Date in Response header:", headerDate);

//     const users = res.data;

//     for (user of users) {
//       console.log(`Got user with id: ${user.id}, name: ${user.name}`);
//     }
//   })
//   .catch((err) => {
//     console.log("Error: ", err.message);
//   });

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port no ${PORT}`);
});
