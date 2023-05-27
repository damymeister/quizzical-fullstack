const mongoose = require("mongoose")
const resultSchema = new mongoose.Schema({
userId: {type: String, required:true},
outcome: { type: Number, required: true },
CurrentDate: {type: String, required:true},
counter:{ type: Number, required: true },
})

const Result = mongoose.model("Result", resultSchema)

module.exports =  Result 
    