const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const reqString = {
  type: String,
  required: true
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isInitialized: {
    type: Boolean,
    default: false
  },
  backupEmail: String,
  resetToken: String,
  expireToken: Date,
  pic: {
    type: String,
    default: "https://res.cloudinary.com/xiaomiao/image/upload/v1667155720/no-image-avatar-vector-icon-600w-2054244497_xdhqa3.jpg"
  },
  nickname: String,
  workemail: String,
  phone: String,
  homephone: String,
  workphone: String,
  homefax: String,
  workfax: String,
  url: String,
  workurl: String,
  birthday:String,
  address:String,
  workaddress:String,
  title: String,
  role: String,
  organization: String,
  links: [{ type: String }],
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
  socials: {
    facebook: { type: String },
    whatsapp: { type: String },
    telegram: { type: String },
    linkedin: { type: String },
    line: { type: String },
    skype: { type: String },
    twitter: { type: String },
    wechat: { type: String },
    instagram: { type: String },
    reddit: { type: String },
    grab: { type: String },
    foodpanda: { type: String },
    lazada: { type: String },
    shopee: { type: String },
    taobao: { type: String },
    carousell: { type: String },
    pokemon: { type: String },
    nintendo: { type: String },
    steam: { type: String },
    tng: { type: String },
    bankacc: { type: String },
  },
  notes: {
    type: String,
    default: "this is something about me"
  },
  display: {
    type: String,
    default: "list"
  },
  facebook: { type: String },
  whatsapp: { type: String },
  telegram: { type: String },
  linkedin: { type: String },
  line: { type: String },
  skype: { type: String },
  twitter: { type: String },
  wechat: { type: String },
  instagram: { type: String },
  foursquare: { type: String },
  xiaohongshu: { type: String },
  reddit: { type: String },
  grab: { type: String },
  foodpanda: { type: String },
  lazada: { type: String },
  shopee: { type: String },
  taobao: { type: String },
  carousell: { type: String },
  pokemon: { type: String },
  nintendo: { type: String },
  steam: { type: String },
  tng: { type: String },
  bankacc: { type: String },
})

mongoose.model("User", userSchema)