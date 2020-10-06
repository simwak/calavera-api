function getManifest(releaseName, user, userNamespace) {
  return {
    "apiVersion": "rbac.authorization.k8s.io/v1",
    "kind": "Role",
    "metadata": {
      "name": `${releaseName}-code-server-${user}`,
      "namespace": userNamespace
    },
    "rules": [
      {
        "apiGroups": ["", "extensions", "apps", "traefik.containo.us"],
        "resources": ["*"],
        "verbs": ["*"]
      },
      {
        "apiGroups": ["batch"],
        "resources": ["jobs","cronjobs"],
        "verbs": ["*"]
      }
    ]
  }
}

module.exports = {
  getManifest
}