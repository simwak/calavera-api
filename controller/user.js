const express = require('express')
const ldap = require('../modules/ldap.js')
const keycloak = require('../modules/keycloak.js').get()

var router = express.Router()

router.patch('/password', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  var token = req.kauth.grant.access_token.content
  var response = await ldap.changePassword(token.preferred_username, req.body.password)
  res.send(response)
})

router.get('/', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  var token = req.kauth.grant.access_token.content
  var response = await ldap.getUser(token.preferred_username)
  res.send(response[0])
})

router.get('/:uid', keycloak.protect('realm:administrator'), async (req, res) => {
  var uid = req.params.uid
  var response = await ldap.getUser(uid)
  res.send(response[0])
})

router.delete('/:uid', keycloak.protect('realm:administrator'), async (req, res) => {
  var uid = req.params.uid
  var response = await ldap.deleteUser(uid)
  res.send(response)
})

router.put('/', keycloak.protect('realm:administrator'), async (req, res) => {
  var p = req.body
  var response = await ldap.addUser(p.firstname, p.lastname, p.mail, p.uid, p.password)
  res.send(response)
})

module.exports = router