const router = require("express").Router()
const { User, validate } = require("../Models/User")
const bcrypt = require("bcrypt")

router.post("/", async (req, res) => {
    try {
            const { error } = validate(req.body)
            if (error) return res.status(400).send({ message: error.details[0].message })
            const user = await User.findOne({ email: req.body.email })
            if (user) return res.status(409).send({ message: "User with given email already Exist!" })
            const usname = await User.findOne({name: req.body.name})
            if(usname) return res.status(409).send({ message: "User with given name already Exist!" })
            const salt = await bcrypt.genSalt(Number(process.env.SALT))
            const hashPassword = await bcrypt.hash(req.body.password, salt)
            await new User({ ...req.body, password: hashPassword }).save()
            res.status(201).send({ message: "User created successfully" })
    } catch (error) {
            res.status(500).send({ message: "Internal Server Error" })
    }
})


router.get("/:userId", async (req, res) => {
        try {
          const userId = req.params.userId;
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }
      
          res.status(200).send(user);
        } catch (error) {
          res.status(500).send({ message: "Internal Server Error" });
        }
      });
      router.put("/:userId", async (req, res) => {
        try {
          const { error } = validate(req.body);
          if (error) return res.status(400).send({ message: error.details[0].message });
      
          const userId = req.params.userId;
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }
      
          if (req.body.email !== user.email) {
            const userr = await User.findOne({ email: req.body.email });
            if (userr) {
              return res.status(409).send({ message: "User with given email already exists!" });
            }
          }
      
          if (req.body.name !== user.name) {
                const usname = await User.findOne({ email: req.body.name });
                if (userr) {
                  return res.status(409).send({ message: "User with given name already exists!" });
                }
              }

          var passwordChanged = false;
      
          user.name = req.body.name;
          user.email = req.body.email;
      
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const hashPassword = await bcrypt.hash(req.body.password, salt);
      
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              return console.error(err);
            }
            if (!result) {
              passwordChanged = true;
            }
          });
      
          user.password = hashPassword;
          await user.save();
      
          res.status(200).send({ message: "User updated successfully", passwordChanged });
        } catch (error) {
          res.status(500).send({ message: "Internal Server Error" });
        }
      });
      
router.delete("/:userId", async (req, res) => {
        try {
          const userId = req.params.userId;
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }
      
          await User.deleteOne({ _id: userId })
      
          res.status(200).send({ message: "User deleted successfully" });
        } catch (error) {
          res.status(500).send({ message: "Internal Server Error" });
        }
      });
      
module.exports = router