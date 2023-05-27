const router = require("express").Router()
const { User } = require("../Models/User")
const bcrypt = require("bcrypt")
const Joi = require("joi")

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) res.status(400).send({ message: error.details[0].message })

        const user = await User.findOne({ name: req.body.name })

        if (!user) return res.status(401).send({ message: "Invalid Username or Password" })
        const validPassword = await bcrypt.compare(
                                    req.body.password,
                                    user.password
                                    )

        if (!validPassword) return res.status(401).send({ message: "Invalid Username or Password" })

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Logged in successfully" })
        } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
}
})

const validate = (data) => {
    const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    password: Joi.string().required().label("Password"),
})
    return schema.validate(data)
}
module.exports = router