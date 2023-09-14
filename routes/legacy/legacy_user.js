//legacy user.js function

/* router.put('/deletepic', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic cannot post" })
      }
      res.json(result)
    })
}) */

/* router.get('/getpic', requireLogin, (req, res) => {
  res.json(req.user.pic)
  console.log(req.user.pic)
})
 */

/* router.put('/user/cloudinary', (req, res) => {
  const timestamp = Math.round((new Date).getTime() / 1000);
  console.log("req received is ", req.body.text)
  if (req.body.oldpic !== "no-image-avatar-vector-icon-600w-2054244497_xdhqa3") {

    cloudinary.uploader.destroy(req.body.oldpic)
    .then(result => console.log(result))
  }

  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
  }, CLOUDNIARY_SECRET);
  console.log("signature IS ", signature)
}) */

/* router.get('/user/:id', (req,res)=>{
  User.findOne({_id:req.params.id})
  .select("-password")
  .then(user=>{
    Post.find({postedBy:req.params.id})
    .populate("postedBy", "_id name")
    .exec((err,posts)=>{
      if(err){
        return res.status(422).json({error:err})
      }
      res.json({user,posts})
      console.log({user})
    })
  }).catch(err=>{
    return res.status(404).json({error:"User not found"})
  })
}) */

/* router.put('/follow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.body.followId, {
    $push: { followers: req.user._id }
  }, {
    new: true
  }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    }
    User.findByIdAndUpdate(req.user._id, {
      $push: { following: req.body.followId }
    }, {
      new: true
    }).select("-password").then(result => {
      res.json(result)
    }).catch(err => {
      return res.status(422).json({ error: err })
    })
  })
}) */

/* router.put('/unfollow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {
    $pull: { followers: req.user._id }
  }, {
    new: true
  }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    }
    User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.body.unfollowId }
    }, {
      new: true
    }).select("-password").then(result => {
      res.json(result)
    }).catch(err => {
      return res.status(422).json({ error: err })
    })
  })
}) */
