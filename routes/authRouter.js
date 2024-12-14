const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({msg: "User not found"})
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" })
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    delete user.password
    res.status(200).json({token, user})

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email, 
      password: passwordHash,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser)
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
