function getManifest(releaseName, user) {
  return {
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
      "name": `${releaseName}-code-server-${user}`
    },
    "spec": {
      "type": "ClusterIP",
      "selector": {
        "app": `${releaseName}-code-server-${user}`
      },
      "ports": [
        {
          "protocol": "TCP",
          "port": 80,
          "targetPort": "code-server",
          "name": `${releaseName}-code-server-${user}`
        }
      ]
    }
  }
}

module.exports = {
  getManifest
}