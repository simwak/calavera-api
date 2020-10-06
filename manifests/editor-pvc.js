function getManifest(releaseName, user) {
  return {
    "apiVersion": "v1",
    "kind": "PersistentVolumeClaim",
    "metadata": {
      "name": `${releaseName}-code-server-${user}`
    },
    "spec": {
      "accessModes": ["ReadWriteOnce"],
      "resources": {
        "requests": {
          "storage": "10Gi"
        }
      }
      
    }
  }
}

module.exports = {
  getManifest
}