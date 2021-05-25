const express = require('express')
const app = express()
const router = express.Router()

app.set('view engine', 'pug') //setting the view engine to pug
app.set('views', 'views') //go to folder called views

router.get('/', (req, res, next) => {
  res.status(200).render('login')
})

module.exports = router
