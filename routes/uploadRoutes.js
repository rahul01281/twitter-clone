const express = require('express')
const app = express()
const router = express.Router()
const path = require('path')

router.get('/images/:path', (req, res, next) => {
  res.sendFile(path.join(__dirname, `../uploads/images/${req.params.path}`)) //need path of image here
})

module.exports = router
