const express = require("express");
const router = express.Router();
const Validator = require("validator");
const Survey = require("../db/models/survey");

router.post("/send_data", async (req, res) => {
  const {
    name,
    email,
    age,
    role,
    recommendation_status,
    favorite_feature,
    improvements,
    suggestions,
  } = req.body;

  try {
    if (!name || !email) {
      return res.status(422).json({ error: "Fill all required fields" });
    }
    if (!Validator.isEmail(email)) {
      return res.status(422).json({ error: "Invalid Email" });
    }
    const add_data = new Survey({
      name,
      email,
      age,
      role,
      recommendation_status,
      favorite_feature,
      improvements,
      suggestions,
    });
    await add_data.save();
    res.status(201).json({ message: "From Submitted Successfully" });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
