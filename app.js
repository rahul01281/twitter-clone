const express = require('express')
const app = express()
const PORT = 3003

const server = app.listen(PORT, () =>
  console.log(`server listening on port ${PORT}`)
)

app.set('view engine', 'pug') //setting the view engine to pug
app.set('views', 'views') //go to folder called views

app.get('/', (req, res, next) => {
  res.status(200).render('home')
})
