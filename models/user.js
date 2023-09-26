const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const reqString = {
  type: String,
  required: true,
};

const userSchema = new mongoose.Schema({
  name: reqString,
  theme: { type: String, default: "root" },
  email: reqString,
  password: reqString,
  isInitialized: {
    type: Boolean,
    default: false,
  },
  backupEmail: String,
  resetToken: String,
  expireToken: Date,
  cooldownToken: Date,
  firstime:Boolean,
  pic: {
    type: String,
    //default: "https://res.cloudinary.com/xiaomiao/image/upload/v1667155720/no-image-avatar-vector-icon-600w-2054244497_xdhqa3.jpg"
  },
  coverPic: {
    type: String,
  },
  vcard: {
    name: String,
    nickname: String,
    phone: String,
    email: String,
    //workemail: String,
    //homephone: String,
    //workphone: String,
    //homefax: String,
    //workfax: String,
    organization: String,
    title: String,
    url: String,
    //workurl: String,
    //birthday: String,
    address: String,
    //workaddress: String,
    notes: String,
    //role: String,
  },
  nickname: String,
  contactemail: String,
  workemail: String,
  phone: String,
  homephone: String,
  workphone: String,
  homefax: String,
  workfax: String,
  url: String,
  workurl: String,
  //birthday: String,
  address: String,
  maplink: String,
  workaddress: String,
  title: String,
  role: String,
  organization: String,
  /*  links: [{ type: String }], */
  /* followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }], */
  socials: [
    {
      app: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
    },
    /* facebook: { type: String },
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
    bankacc: { type: String }, */
  ],
  sales: [
    {
      app: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
    },
  ],
  notes: {
    type: String,
    default: "this is something about me",
  },
  display: {
    type: String,
    default: "list",
  },
  links: [
    {
      title: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
    },
  ],
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
});

function arrayLimit(val) {
  return val.length <= 3;
}

mongoose.model("User", userSchema);
