function getManifest(releaseName, user, entrypoint, domain, certResolver) {
  return {
    "apiVersion": "traefik.containo.us/v1alpha1",
    "kind": "IngressRoute",
    "metadata": {
      "name": `${releaseName}-code-server-${user}`
    },
    "spec": {
      "entryPoints": [
        entrypoint
      ],
      "routes": [
        {
          "match": "Host(`" + domain + "`)",
          "kind": "Rule",
          "services": [
            {
              "name": `${releaseName}-code-server-${user}`,
              "port": 80,
              "scheme": "http"
            }
          ]
        }
      ],
      "tls": {
        "certResolver": certResolver
      }
    }
  }
}

module.exports = {
  getManifest
}