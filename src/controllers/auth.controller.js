require("dotenv").config();
const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");

router.post("/register", async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = new User({
        name,
        email,
        password,
    });
    user.password = await user.encryptPassword(user.password);

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    res.json({ message: "Received and saved", token, auth: true });
});

router.post("/login", async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("The email doesn't exist");

    const validPassword = await user.validatePassword(req.body.password);
    if (!validPassword)
        return res.status(401).json({ auth: false, token: null });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    res.json({ auth: true, token });
});

router.get("/me", verifyToken, async (req, res, next) => {
    const user = await User.findById(req.userId, { password: 0 });

    if (!user) return res.status(404).json({ message: "User not found" });
    // if (response) return res.status(401).json(response);

    res.json(user);
});

module.exports = router;
