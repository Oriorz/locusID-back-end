const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Link = mongoose.model("Link")
const requireLogin = require('../middleware/requireLogin')

router.post('/createlink',  (req, res) => {
    console.log('create link was called')
    return res.json({link:"is link 1"})
})

module.exports = router