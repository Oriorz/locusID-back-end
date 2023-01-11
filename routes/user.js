const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model("User")
const { CLOUDINARY_NAME, CLOUDINARY_API, CLOUDNIARY_SECRET } = require('../config/key')
const cloudinary = require('cloudinary').v2;
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API,
  api_secret: CLOUDNIARY_SECRET
});

router.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password")
    //console.log({user})
    res.json({ user })
  }
  catch (err) {
    return res.status(404).json({ error: "User not found" })
  }
})
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password")
    //console.log({user})
    res.json({ user })
  }
  catch (err) {
    return res.status(404).json({ error: "User not found" })
  }
})


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

router.put(/^\/(?:api\/)?updatepic$/, requireLogin, (req, res) => {
//router.put('/updatepic', requireLogin, (req, res) => {

  console.log("req received is ", req.body.oldpic)
  if (req.body.oldpic !== "no-image-avatar-vector-icon-600w-2054244497_xdhqa3") {

    cloudinary.uploader.destroy(req.body.oldpic)
      .then(result => console.log("deleted pic ", result))
  }
  User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic cannot post" })
      }
      res.json(result)
    })
})

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
router.put('/updatedetails/:detail', requireLogin, (req, res) => {
  console.log("this is /updatedetails/:detail ", req.params.detail, req.body.value, req.user._id)
  const tkey = req.params.detail
  User.findByIdAndUpdate(req.user._id, { $set: { [`${tkey}`]: req.body.value } }, { new: true },
    //User.findByIdAndUpdate(req.user._id, {$set:{socials:{[`${tkey}`]:req.body.value}}},{new:true},
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic cannot post" })
      }
      res.json(result)
    })
})
router.put('/api/updatedetails/:detail', requireLogin, (req, res) => {
  console.log("this is /api/updatedetails/:detail ", req.params.detail)
  const tkey = req.params.detail
  User.findByIdAndUpdate(req.user._id, { $set: { [`${tkey}`]: req.body.value } }, { new: true },
    //User.findByIdAndUpdate(req.user._id, {$set:{socials:{[`${tkey}`]:req.body.value}}},{new:true},
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic cannot post" })
      }
      res.json(result)
    })
})

module.exports = router