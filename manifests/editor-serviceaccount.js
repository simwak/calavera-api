function getManifest(releaseName, user) {
  return {
    "apiVersion": "v1",
    "kind": "ServiceAccount",
    "metadata": {
      "name": `${releaseName}-code-server-${user}`
    }
  }
}

module.exports = {
  getManifest
}