var Keycloak = require('keycloak-connect')
const configAuth = require('../modules/config.js').getAuth()

var instance

var config = {
  clientId: configAuth.clientId,
  bearerOnly: true,
  serverUrl: configAuth.url,
  realm: configAuth.realm
}

function init(memoryStore) {
  console.log("Initializing Keycloak...")
  instance = new Keycloak({ store: memoryStore }, config)
}

function get() {
  return instance
}

module.exports = {
  init,
  get
}