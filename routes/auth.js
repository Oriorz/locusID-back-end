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
      <p>Dear iTap Owner,</p>
      <br></br>
      <p>Thank you for Registering with iTap</p>
      <br></br>
      <p>Your Login Account is ${to}</p>
      <p>To activate your account please click the link below</p>
      <h5> <a href="http://itap.world/setup/${token}">http://itap.world/setup/${token}</a> </h5>
      <br></br>
      <br></br>
      <p>Kind Regards,</p>
      <br></br>
      <p>Team of iTap World</p>
      `,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: "An error has occured, mailed not sent" });
      }
      return resolve({ message: "Email sent successfully", status:"ok" });
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
      user.cooldownToken = Date.now() +120000;
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
        user.cooldownToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "password updated success" });
        });
      });
    })
    .catch((err) => console.log(err));
});

router.post(/^\/(?:api\/)?bind-email$/, async (req, res) => {
  try {
    const { userid, password, email } = req.body;
    /* console.log("bind-email received ", userid, password, email); */
    // Check if the user exists
    const user = await User.findOne({ _id: userid });
    /* console.log("user from user.FindOne return is ", user) */
    if (!user) {
      return res.status(422).json({ error: "User does not exist with that id" });
    }
    //check if the user is initialized
    if (user?.isInitialized) {
      return res.status(422).json({ error: "user already registered" });
    }
    //compare if the user password is correct
    const passwordcorrect = await bcrypt.compare(password, user.password)
    /* console.log("passwordcorrect ", passwordcorrect) */
    if (!passwordcorrect) {
      return res.status(422).json({ error: "User Password not correct" });
    }
    // Generate the token and send email
    const token = crypto.randomBytes(32).toString("hex");
    user.backupEmail = email;
    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;
    user.cooldownToken = Date.now() +120000;
    const emailResult = await bindEmail(email, token);
    console.log("emailResult ", emailResult)
    const saveUser = await user.save()
    if (!saveUser) {
      return res.status(422).json({ error: "User Not Saved" });
    }
    res.json({ token });

  } catch (error) {
    // Handle other errors
    console.error("Error in bind-email:", error);
    res.status(500).json({ error: "Internal server error" });
  }

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
  /* const name = req.body.name; */
  //const email = req.body.email
  if (!newPassword /* || !name */) {
    return res.status(422).json({ error: "please fill in password" });
  }
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "no user found or token expired" });
      } else {
        console.log("called");
        console.log(user)
        //return res.json({ user })
        bcrypt
          .hash(newPassword, 12)
          .then((hashedpassword) => {
            user.password = hashedpassword;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.cooldownToken = undefined;
            /* user.name = name; */
            user.email = user.backupEmail;
            user.backupEmail = undefined;
            user.isInitialized = true;
            user.firstime = true;
            user
              .save()
              .then((savedUser) => {
                console.log("savedUser" , savedUser);
                res.json({ message: "account setup successful", id:savedUser._id });
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

router.post(/^\/(?:api\/)?try$/, requireLogin, (req, res) => {
  /* const email = req.user.email */
  console.log("enter try POS")
  console.log("email ", req.user)
  res.status(200).json({ message: "the user email is ok: " })
})



module.exports = router;
