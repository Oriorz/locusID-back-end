const mongoose = require('mongoose')
const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
})

mongoose.model("Link", linkSchema)