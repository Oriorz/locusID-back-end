const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, SENDGRID_API } = require('../config/key.js')
const requireLogin = require('../middleware/requireLogin')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: SENDGRID_API
  }
}))

/* router.post('/adminsignup', requireLogin, (req, res) => {
  const { name, email, password, pic } = req.body
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" })
  }
  if (req.user.email !== "cmloh1208@gmail.com") {
    return res.status(422).json({ error: "only admin can access" })
  }
  bcrypt.hash(password, 12)
    .then(hashedpassword => {
      const user = new User({
        email,
        name,
        password: hashedpassword,
        pic
      })
      user.save()
        .then((result) => {
          const userData = req.body
          const id = result._id
          const fs = require('fs');
          const filename = '../back-end/config/userlist.json'
          // Read the JSON file
          fs.readFile(filename, (err, data) => {
            if (err) throw err;
            // Parse the JSON string
            let json = JSON.parse(data);
            // Add a new item to the JSON object
            userData["id"] = id.toString()
            json.push(userData)
            // Convert the updated JSON object to a string
            let updatedJson = JSON.stringify(json);
            // Write the updated JSON string to the file
            fs.writeFile(filename, updatedJson, (err) => {
              if (err) throw err;
              console.log('The file has been updated');
            });
          });
          res.json({ message: "saved to DB and updated to JSON successfully" })
        })
        .catch(err => {
          console.log(err)
        })
    })
  //}
}) */

/* router.post('/signup', (req, res) => {
  //signup router is supposed to check the email of the user, if exist, return error,
  //if not then register the user
  const { name, email, password, pic } = req.body
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" })
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "user already existed with that email" })
      }
      bcrypt.hash(password, 12)
        .then(hashedpassword => {
          const user = new User({
            email,
            name,
            password: hashedpassword,
            pic
          })
          user.save()
            .then((user) => {
              transporter.sendMail({
                to: user.email,
                from: "cmloh1208@gmail.com",
                subject: "signup success",
                html: "<h1> Welcome to iTap</h1>"
              })
              res.json({ message: "saved successfully" })
            })
            .catch(err => {
              console.log(err)
            })
        })

    })
    .catch(err => {
      console.log(err)
    })
}) */

//legacy signin
/* router.post('/signin', (req, res) => {
  //signin router need to check if both email and password is present, if it is
  //then it proceed to check against the DB for if the email is registered
  //if the email is registered then need to check the hashedpassword if is the same
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).json({ error: "please insert email or password" })
  }
  User.findOne({ email: email })
    .then(savedUser => {
      if (!savedUser) {
        return res.status(422).json({ error: "email not registered" })
      }
      bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
          if (doMatch) {
            //res.json({message:"successfully sign in"})
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
            const { _id, name, email, followers, following, pic } = savedUser
            res.json({ token, user: { _id, name, email, followers, following, pic } })
          }
          else {
            return res.status(422).json({ error: "please insert correct email and password" })
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
}) */

router.post(/^\/(?:api\/)?signin$/, (req, res) => {
  //signin router need to check if both email and password is present, if it is
  //then it proceed to check against the DB for if the email is registered
  //if the email is registered then need to check the hashedpassword if is the same
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).json({ error: "please insert email or password" })
  }

  User.findOne({ email: email })
    .then(savedUser => {
      if (!savedUser) {
        return res.status(422).json({ error: "email not registered" })
      }
      bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
            const { password, ...userMinusPW } = savedUser._doc
            res.json({ token, user: userMinusPW })
          }
          else {
            return res.status(422).json({ error: "please insert correct email and password" })
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
})


/* router.post(/^\/(?:api\/)?try$/, (req, res) => {
  res.status(200).json({message:"this is both /api/try and /try route"})
}) */

router.post(/^\/(?:api\/)?reset-password$/, (req, res) => {
  // for user to reset password
  // the flow is like this, system randomly created a token, store this token in database under the user
  // and at the same time, send email to the user containing the link which contains the token
  // if the user click this link, should initiate the process of first time user setup
  // in this case we find the user by the unique email
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err)
    }
    const token = buf.toString('hex')
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(422).json({ error: "user don't exist with that email" })
        }
        user.resetToken = token
        user.expireToken = Date.now() + 3600000
        user.save().then((result) => {
          transporter.sendMail({
            to: user.email,
            from: "cmloh1208@gmail.com",
            subject: "password reset",
            html: `
          <p>You requested for password reset</p>
          <h5>click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
          `
          })
          res.json({ message: "check your email" })
        })
      })
  })
})

router.post(/^\/(?:api\/)?new-password$/, (req, res) => {
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        return res.status(422).json({ error: "no user found or token expired" })
      }
      bcrypt.hash(newPassword, 12).then(hashedpassword => {
        user.password = hashedpassword
        user.resetToken = undefined
        user.expireToken = undefined
        user.save().then((savedUser) => {
          res.json({ message: "password updated success" })
        })
      })
    }).catch(err => console.log(err))
})


/* router.post('/first-time-user', async (req, res) => {
  const { name, password, token } = req.body
  if (!password || !name) {
    return res.status(422).json({ error: "please add all the fields" })
  }
  User.findOne({ resetToken: token })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "no user found or token expired" })
      } else {
        console.log(user.email)
        return res.json({ user })
        

      }

    })
}) */

router.post(/^\/(?:api\/)?bind-email$/, (req, res) => {
  //console.log(req.body)
  //return res.status(422).json({message:req.body})
  const { userid, password, email } = req.body
  console.log(userid, password, email)
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err)
    }
    const token = buf.toString('hex')
    User.findOne({ _id: userid })
      .then(user => {
        if (!user) {
          return res.status(422).json({ error: "user don't exist with that id" })
        }
        user.backupEmail = email
        user.resetToken = token
        user.expireToken = Date.now() + 3600000
        bcrypt.compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {

              user.save().then((result) => {
                transporter.sendMail({
                  to: email,
                  from: "cmloh1208@gmail.com",
                  subject: "iTap Email activation",
                  html: `
            <p>You requested for iTap account activation</p>
            <h5>click on this <a href="http://localhost:3000/setup/${token}">link</a> to activate your account and set your password</h5>
            `
                })
              })
              return res.json({ token, user })
            }
            else {
              return res.status(422).json({ error: "please insert correct password" })
            }
          })
        //console.log(user)
        //res.json({ message: "check your email" })
      })
  })



})

//similar to reset-password
//but checking if is the email existing first, since email is unique field we cant let it duplicate
//then we find user by id, if correct (and shouldbe correct)
// then we change the name, email and password
// while name and password should be coming from user input, Email should be from previous steps
// which by now should be in the "backupEmail" field

router.post(/^\/(?:api\/)?new-account$/, async (req, res) => {
  const newPassword = req.body.password
  const sentToken = req.body.token
  const name = req.body.name
  //const email = req.body.email
  if (!newPassword || !name) {
    return res.status(422).json({ error: "please add all the fields" })
  }
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "no user found or token expired" })
      } else {
        console.log('called')
        //return res.json({ user })
        bcrypt.hash(newPassword, 12)
          .then(hashedpassword => {
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.name = name
            user.email = user.backupEmail
            user.backupEmail = undefined
            user.isInitialized = true
            user.save().then((savedUser) => {
              console.log(savedUser)
              return res.json({ message: "account setup successful" })
            }).catch(err => console.log(err))
          }).catch(err => console.log(err))
      }
    }).catch(err => console.log(err))
})

module.exports = router