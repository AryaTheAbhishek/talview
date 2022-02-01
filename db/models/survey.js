const mongoose = require("mongoose");
const survey = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  recommendation_status: {
    type: String,
    required: true,
  },
  favorite_feature: {
    type: String,
    required: true,
  },
  improvements: {
    type: String,
    required: true,
  },
  suggestions: {
    type: String,
    required: true,
  },
});

const Survey = mongoose.model("survey_data", survey);
module.exports = Survey;
