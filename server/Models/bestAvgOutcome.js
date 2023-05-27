const mongoose = require("mongoose");

const bestAvgOutcomeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bestAvgOutcome: { type: Number, required: true },
  allResults: { type: [Number], required: true },
  testNumbers: { type: Number, required:true}
});

const BestAvgOutcome = mongoose.model("BestAvgOutcome", bestAvgOutcomeSchema);

module.exports = BestAvgOutcome;
