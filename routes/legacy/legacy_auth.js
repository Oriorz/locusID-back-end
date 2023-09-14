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

/* const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: SENDGRID_API
  }
})) */

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

/* router.post(/^\/(?:api\/)?try$/, (req, res) => {
  res.status(200).json({message:"this is both /api/try and /try route"})
}) */
