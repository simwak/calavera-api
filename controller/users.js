const express = require('express')
const ldap = require('../modules/ldap.js')
const keycloak = require('../modules/keycloak.js').get()

var router = express.Router()

router.get('/', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  var response = await ldap.getUsers()
  res.send(response)
})

module.exports = router