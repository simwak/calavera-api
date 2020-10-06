const config = require('/var/calavera/config/config.json')
const configInternal = require('/var/calavera/config/configInternal.json')
const configAuth = require('/var/calavera/config/configAuth.json')

function get() {
  return config
}

function getInternal() {
  return configInternal
}

function getAuth() {
  return configAuth
}

module.exports = {
  get,
  getInternal,
  getAuth
}