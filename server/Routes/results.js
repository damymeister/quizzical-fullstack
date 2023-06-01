const router = require("express").Router()
const Result  = require("../Models/Result")
const bestAvgOutcome = require("../Models/bestAvgOutcome")
const { User, validate } = require("../Models/User")
router.post("/", async (req, res) => {
    try {
     {
        const userId = req.body.userId;
        const user = await Result.findOne({ userId }).sort({ counter: -1 }) .exec();
    if (user) {
        if(user.counter >=10){
          const oldestResult = await Result.findOne({ userId }).sort({ CurrentDate: 1 }).exec();
            if (oldestResult) {
              const updatedResult = await Result.updateOne(
                { _id: oldestResult._id },
                { $set: { ...req.body } })
              const updatedArray = await bestAvgOutcome.updateOne(
                { userId: oldestResult.userId },
                { $set: { [`allResults.${oldestResult.counter-1}`]: req.body.outcome } }
              );
              if(updatedResult && updatedArray){
                const userResults = await bestAvgOutcome.findOne({ userId: oldestResult.userId })
                const currResultsArray = [...userResults.allResults];
                var suma = 0
                for(var i=0; i< currResultsArray.length ; i++) {
                   suma += currResultsArray[i]
                }
                const newAvg = suma/currResultsArray.length;
                await bestAvgOutcome.updateOne({ userId },{ $set: { bestAvgOutcome: newAvg, allResults: currResultsArray, testNumbers: currResultsArray.length } })
              }
            }
        }
      else{
        const userResults = await bestAvgOutcome.findOne({ userId: user.userId })
        const newCounter = user.counter + 1;
        const currResultsArray = [...userResults.allResults, req.body.outcome];
        var suma = 0
         for(var i=0; i < currResultsArray.length ; i++) {
            suma += currResultsArray[i]
         }
         const newAvg = suma/currResultsArray.length;
        await new Result({...req.body,counter: newCounter}).save();
        await bestAvgOutcome.updateOne({ userId },  { $set: { bestAvgOutcome: newAvg, allResults: currResultsArray, testNumbers: currResultsArray.length } }
          );
      }
    }
        else{
            await new Result({ ...req.body, counter: 1 }).save();
            await new bestAvgOutcome({userId:req.body.userId, bestAvgOutcome: req.body.outcome, allResults: [req.body.outcome] ,  testNumbers: 1 }).save();
        }
     }
      } catch (error) {
        console.error(error);
      }
})

router.get("/", async (req, res) => {
    try {
      const allData = await bestAvgOutcome.find();
      const userData = await Promise.all(
        allData.map(async (data) => {
          const user = await User.findById(data.userId);
          return {
            userId: data.userId,
            bestAvgOutcome: data.bestAvgOutcome,
            name: user ? user.name : "Unknown",
          };
        })
      );
  
      if (!userData.length) {
        return res.status(404).send({ message: "Database is empty" });
      }
      res.status(200).send(userData);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
  

  router.get("/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findOne({ _id: userId });
      const userResults = await Result.find({ userId: userId });
      const bestavg = await bestAvgOutcome.findOne({ userId: userId });
      if (!user || !bestAvgOutcome) {
        return res.status(404).send({ message: "Data not found" });
      }
      const results = userResults.map((data) =>({
       outcome: data.outcome,
       counter: data.counter,
       date: data.CurrentDate
      })
      )
      const userdata = {
        username: user.name,
        email: user.email,
        results:results,
        bestavg : bestavg.bestAvgOutcome
      }
      res.status(200).send(userdata);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
  module.exports = router;
  