const express = require('express')
const app = express()
const router = express.Router()
const User = require('../models/UserSchema')

router.get('/', (req, res, next) => {
  var payload = {
    pageTitle: 'My Profile',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    profileUser: req.session.user,
  }

  res.status(200).render('profilePage', payload)
})

router.get('/:username', async (req, res, next) => {
  var payload = await getPayload(req.params.username, req.session.user)

  res.status(200).render('profilePage', payload)
})

async function getPayload(username, userLoggedIn) {
  var user = await User.findOne({ username: username })
  if (user === null) {
    return {
      pageTitle: 'User not found',
      userLoggedIn: userLoggedIn,
      userLoggedInJs: JSON.stringify(userLoggedIn),
    }
  }

  return {
    pageTitle: user.username,
    userLoggedIn: userLoggedIn,
    userLoggedInJs: JSON.stringify(userLoggedIn),
    profileUser: user,
  }
}

module.exports = router
