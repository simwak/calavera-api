function getManifest(releaseName, user, password) {
  return {
    "apiVersion": "v1",
    "kind": "Secret",
    "metadata": {
      "name": `${releaseName}-code-server-${user}`
    },
    "type": "Opaque",
    "stringData": {
      "password": password
    }
  }
}

module.exports = {
  getManifest
}