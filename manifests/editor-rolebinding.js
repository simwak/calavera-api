function getManifest(releaseName, user, namespace, userNamespace) {
  return {
    "apiVersion": "rbac.authorization.k8s.io/v1",
    "kind": "RoleBinding",
    "metadata": {
      "name": `${releaseName}-code-server-${user}`,
      "namespace": userNamespace
    },
    "roleRef": {
      "apiGroup": "rbac.authorization.k8s.io",
      "kind": "Role",
      "name": `${releaseName}-code-server-${user}`
    },
    "subjects": [
      {
        "kind": "ServiceAccount",
        "name": `${releaseName}-code-server-${user}`,
        "namespace": namespace
      }
    ]
  }
}

module.exports = {
  getManifest
}