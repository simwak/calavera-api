function getManifest(releaseName, user, userNamespace) {
  return {
    "apiVersion": "apps/v1",
    "kind": "Deployment",
    "metadata": {
      "name": `${releaseName}-code-server-${user}`
    },
    "spec": {
      "selector": {
        "matchLabels": {
          "app": `${releaseName}-code-server-${user}`
        }
      },
      "replicas": 1,
      "template": {
        "metadata": {
          "labels": {
            "app": `${releaseName}-code-server-${user}`
          }
        },
        "spec": {
          "serviceAccountName": `${releaseName}-code-server-${user}`,
          "automountServiceAccountToken": true,
          "containers": [
            {
              "name": "code-server",
              "image": "simwak/k8s-code-server:latest",
              "ports": [
                {
                  "containerPort": 8080,
                  "name": "code-server"
                }
              ],
              "securityContext": {
                "privileged": true
              },
              "env": [
                {
                  "name": "PASSWORD",
                  "valueFrom": {
                    "secretKeyRef": {
                      "name": `${releaseName}-code-server-${user}`,
                      "key": "password"
                    }
                  }
                },
                {
                  "name": "NAMESPACE",
                  "value": userNamespace
                }
              ],
              "resources": {
                "limits": {
                  "memory": "1Gi"
                }
              },
              "volumeMounts": [
                {
                  "name": "data",
                  "mountPath": "/home/coder/"
                }
              ]
            }
          ],
          "volumes": [
            {
              "name": "data",
              "persistentVolumeClaim": {
                "claimName": `${releaseName}-code-server-${user}`
              }
            }
          ]
        }
      }
    }
  }
}

module.exports = {
  getManifest
}