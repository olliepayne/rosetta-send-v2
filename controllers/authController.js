const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = {
 signup,
 login,
 getUser,
 logout,
 delete: deleteOne
}

function signup(req, res) {
 const { username, email, password, passwordCheck } = req.body

 if (!username || !email || !password || !passwordCheck) return res.status(400).json({ msg: 'Incomplete form.' })

 if (password !== passwordCheck) return res.status(400).json({ msg: 'Passwords do not match.' })

 User.findOne({ email })
  .then((user) => {
   if (user) return res.status(400).json({ msg: 'User already exists.' })

   const newUser = new User({
    username,
    email,
    password
   })

   bcrypt.hash(password, 6, (err, hash) => {
    newUser.password = hash
    newUser.save()
     .then((savedUser) => {
      const token = jwt.sign({ user: savedUser }, process.env.JWT_SECRET)
      res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
      res.json(savedUser)
     })
   })
  })
}

function login(req, res) {
 const { email, password } = req.body

 if (!email || !password) return res.status(400).json({ msg: 'Incomplete form.' })

 User.findOne({ email })
  .then((user) => {
   if (!user) return res.status(400).json({ msg: 'User does not exist.' })

   bcrypt.compare(password, user.password, (err, match) => {
    if (!match) return res.status(400).json({ msg: 'Invalid Credentials.' })

    const token = jwt.sign({ user }, process.env.JWT_SECRET)
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
    res.json(user)
   })
  })
}

function getUser(req, res) {
 const token = req.cookies.token
 if(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  res.json(payload.user)
 }
}

function logout(req, res) {
 const token = req.cookies.token
 if(token) {
  res.clearCookie('token')
  res.json({ msg: 'Logged out.' })
 } else {
  res.json({ msg: 'You must be logged in to log out.' })
 }
}

function deleteOne(req, res) {
 const token = req.cookies.token
 const payload = jwt.verify(token, process.env.JWT_SECRET)
 console.log(payload.user._id)
 User.findByIdAndDelete(payload.user._id)
  .then((user) => {
   res.clearCookie('token')
   res.json({ msg: 'Account successfully deleted.' })
  })
}