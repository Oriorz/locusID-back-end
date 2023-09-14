const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, SENDGRID_API, EMAIL_PASS } = require("../config/key.js");
const requireLogin = require("../middleware/requireLogin");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

router.post(/^\/(?:api\/)?signin$/, (req, res) => {
  //signin router need to check if both email and password is present, if it is
  //then it proceed to check against the DB for if the email is registered
  //if the email is registered then need to check the hashedpassword if is the same
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please insert email or password" });
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "email not registered" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { password, ...userMinusPW } = savedUser._doc;
          res.json({ token, user: userMinusPW });
        } else {
          return res
            .status(422)
            .json({ error: "please insert correct email and password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

function resetEmail(to, token) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "contact.itapworld@gmail.com",
        pass: EMAIL_PASS,
      },
    });
    const mail_configs = {
      from: "contact.itapworld@gmail.com",
      to: to,
      subject: "iTap Password Reset",
      html: `
      <p>You requested for password reset</p>
      <h5>click on this <a href="http://itap.world/reset/${token}">link</a> to reset password</h5>
      `,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: "An error has occured, mailed not sent" });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

function bindEmail(to, token) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "contact.itapworld@gmail.com",
        pass: EMAIL_PASS,
      },
    });
    const mail_configs = {
      from: "contact.itapworld@gmail.com",
      to: to,
      subject: "iTap Email activation",
      html: `
      <p>You requested for iTap account activation</p>
      <h5>click on this <a href="http://itap.world/setup/${token}">link</a> to reset password</h5>
      `,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: "An error has occured, mailed not sent" });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

router.post(/^\/(?:api\/)?reset-password$/, (req, res) => {
  // for user to reset password
  // the flow is like this, system randomly created a token, store this token in database under the user
  // and at the same time, send email to the user containing the link which contains the token
  // if the user click this link, should initiate the process of first time user setup
  // in this case we find the user by the unique email
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err);
    }
    const token = buf.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "user don't exist with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        /* transporter.sendMail({
              to: user.email,
              from: "cmloh1208@gmail.com",
              subject: "password reset",
              html: `
          <p>You requested for password reset</p>
          <h5>click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
          `
            }) */
        resetEmail(user.email, token)
          .then((res) => {
            res.json({ message: "check your email" });
          })
          .catch((error) => res.status(500).send(error.message));
      });
    });
  });
});

router.post(/^\/(?:api\/)?new-password$/, (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "no user found or token expired" });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "password updated success" });
        });
      });
    })
    .catch((err) => console.log(err));
});

router.post(/^\/(?:api\/)?bind-email$/, (req, res) => {
  const { userid, password, email } = req.body;
  console.log(userid, password, email);
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err);
    }
    const token = buf.toString("hex");
    User.findOne({ _id: userid }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: "user don't exist with that id" });
      }
      user.backupEmail = email;
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          user.save().then(() => {
            bindEmail(email, token)
              .then((res) => {
                return res.json({ token, user });
              })
              .catch((error) => res.status(500).send(error.message));
          });
        } else {
          return res
            .status(422)
            .json({ error: "please insert correct password" });
        }
      });
      //console.log(user)
      //res.json({ message: "check your email" })
    });
  });
});

//similar to reset-password
//but checking if is the email existing first, since email is unique field we cant let it duplicate
//then we find user by id, if correct (and shouldbe correct)
// then we change the name, email and password
// while name and password should be coming from user input, Email should be from previous steps
// which by now should be in the "backupEmail" field

router.post(/^\/(?:api\/)?new-account$/, async (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  const name = req.body.name;
  //const email = req.body.email
  if (!newPassword || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "no user found or token expired" });
      } else {
        console.log("called");
        //return res.json({ user })
        bcrypt
          .hash(newPassword, 12)
          .then((hashedpassword) => {
            user.password = hashedpassword;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.name = name;
            user.email = user.backupEmail;
            user.backupEmail = undefined;
            user.isInitialized = true;
            user
              .save()
              .then((savedUser) => {
                console.log(savedUser);
                return res.json({ message: "account setup successful" });
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
