const express = require('express')
const editor = require('../modules/editor.js')
const keycloak = require('../modules/keycloak.js').get()
const config = require('../modules/config.js').get()

var router = express.Router()

// Get status information for the editor
router.get('/', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  var token = req.kauth.grant.access_token.content
  res.send(await editor.getStatus(config.releaseName, token.preferred_username, config.namespace, config.domains.editor, config.userNamespace))
})

// Create the deployment
router.put('/', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  var token = req.kauth.grant.access_token.content
  var password = req.body.password
  res.send(await editor.createEditor(config.releaseName, token.preferred_username, password, config.namespace, config.entrypoint, config.domains.editor, config.certResolver, config.userNamespace))
})

// Start the editors pod
router.post('/start', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  var token = req.kauth.grant.access_token.content
  res.send(await editor.startEditor(config.releaseName, token.preferred_username, config.namespace))
})

// Stop the editors pod
router.post('/stop', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  var token = req.kauth.grant.access_token.content
  res.send(await editor.stopEditor(config.releaseName, token.preferred_username, config.namespace))
})

// Delete the deployment
router.delete('/', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  var token = req.kauth.grant.access_token.content
  res.send(await editor.deleteEditor(config.releaseName, token.preferred_username, config.namespace, config.userNamespace))
})

// Change Password
router.patch('/password', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  var token = req.kauth.grant.access_token.content
  var password = req.body.password
  res.send(await editor.changePassword(config.releaseName, token.preferred_username, config.namespace, password))
})

module.exports = router