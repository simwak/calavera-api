const express = require('express')
const keycloak = require('../modules/keycloak.js').get()
const config = require('../modules/config.js').get()
const configAuth = require('../modules/config.js').getAuth()

var router = express.Router()

// Get config
router.get('/', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  res.send(config)
})

// Get auth config
router.get('/auth', async (req, res) => {
  res.send(configAuth)
})

module.exports = router