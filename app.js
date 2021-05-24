const express = require('express')
const app = express()
const PORT = 3003

const server = app.listen(PORT, () =>
  console.log(`server listening on port ${PORT}`)
)

app.get('/', (req, res, next) => {
  res.status(200).send('hello')
})
