const kubernetes = require('./kubernetes.js')
const md5 = require('md5')

const secretManifest = require('../manifests/editor-secret.js')
const serviceaccountManifest = require('../manifests/editor-serviceaccount.js')
const roleManifest = require('../manifests/editor-role.js')
const rolebindingManifest = require('../manifests/editor-rolebinding.js')
const pvcManifest = require('../manifests/editor-pvc.js')
const deploymentManifest = require('../manifests/editor-deployment.js')
const serviceManifest = require('../manifests/editor-service.js')
const ingressrouteManifest = require('../manifests/editor-ingressroute.js')

async function createEditor(releaseName, user, password, namespace, entrypoint, domain, certResolver, userNamespace) {
  try {
    user = user.replace('.', '-')
    var editorDomain = md5(user).substring(0,4) + "." + domain

    const pvc = pvcManifest.getManifest(releaseName, user)

    const serviceaccount = serviceaccountManifest.getManifest(releaseName, user, userNamespace)
    const role = roleManifest.getManifest(releaseName, user, userNamespace)
    const rolebinding = rolebindingManifest.getManifest(releaseName, user, namespace, userNamespace)

    const secret = secretManifest.getManifest(releaseName, user, password)
    const deployment = deploymentManifest.getManifest(releaseName, user, userNamespace)
    const service = serviceManifest.getManifest(releaseName, user)
    const ingressroute = ingressrouteManifest.getManifest(releaseName, user, entrypoint, editorDomain, certResolver)
    
    await kubernetes.client().api.v1.namespaces(namespace).pvc.post({ body: pvc })

    await kubernetes.client().api.v1.namespaces(namespace).serviceaccount.post({ body: serviceaccount })
    await kubernetes.client().apis['rbac.authorization.k8s.io'].v1.namespaces(userNamespace).role.post({ body: role })
    await kubernetes.client().apis['rbac.authorization.k8s.io'].v1.namespaces(userNamespace).rolebinding.post({ body: rolebinding })
    
    await kubernetes.client().api.v1.namespaces(namespace).secret.post({ body: secret })
    await kubernetes.client().apis.apps.v1.namespaces(namespace).deployments.post({ body: deployment })
    await kubernetes.client().api.v1.namespaces(namespace).service.post({ body: service })
    await kubernetes.client().apis['traefik.containo.us'].v1alpha1.namespaces(namespace).ingressroute.post({ body: ingressroute })

    return { "status": "successfull" }
  } catch (e) {
    if(e.code = "409") {
      console.log(e)
      return { "status": "waiting-for-deletion" }
    } else {
      console.log(e)
      return { "status": "failed" }
    }
  }
}

async function deleteEditor(releaseName, user, namespace, userNamespace) {
  user = user.replace('.', '-')
  
  const pvc = pvcManifest.getManifest(releaseName, user)

  const serviceaccount = serviceaccountManifest.getManifest(releaseName, user, userNamespace)
  const role = roleManifest.getManifest(releaseName, user, userNamespace)
  const rolebinding = rolebindingManifest.getManifest(releaseName, user, namespace, userNamespace)

  const secret = secretManifest.getManifest(releaseName, user, "")
  const deployment = deploymentManifest.getManifest(releaseName, user, "")
  const service = serviceManifest.getManifest(releaseName, user)
  const ingressroute = ingressrouteManifest.getManifest(releaseName, user, "", "", "")

  var errors = []

  try {
    await kubernetes.client().api.v1.namespaces(namespace).pvc(pvc.metadata.name).delete()
  } catch (e) {
    errors.push(e.code)
  }

  try {
    await kubernetes.client().api.v1.namespaces(namespace).serviceaccount(serviceaccount.metadata.name).delete()
  } catch (e) {
    errors.push(e.code)
  }

  try {
    await kubernetes.client().apis['rbac.authorization.k8s.io'].v1.namespaces(userNamespace).role(role.metadata.name).delete()
  } catch (e) {
    errors.push(e.code)
  }

  try {
    await kubernetes.client().apis['rbac.authorization.k8s.io'].v1.namespaces(userNamespace).rolebinding(rolebinding.metadata.name).delete()
  } catch (e) {
    errors.push(e.code)
  }

  try {
    await kubernetes.client().api.v1.namespaces(namespace).secret(secret.metadata.name).delete()
  } catch (e) {
    errors.push(e.code)
  }

  try {
    await kubernetes.client().apis.apps.v1.namespaces(namespace).deployments(deployment.metadata.name).delete()
  } catch (e) {
    errors.push(e.code)
  }

  try {
    await kubernetes.client().api.v1.namespaces(namespace).service(service.metadata.name).delete()
  } catch (e) {
    errors.push(e.code)
  }

  try {
    await kubernetes.client().apis['traefik.containo.us'].v1alpha1.namespaces(namespace).ingressroute(ingressroute.metadata.name).delete()
  } catch (e) {
    errors.push(e.code)
  }

  return { "status": "successfull", errors }
}

async function getStatus(releaseName, user, namespace, domain, userNamespace) {
  user = user.replace('.', '-')
  var editorDomain = md5(user).substring(0,4) + "." + domain

  const pvc = pvcManifest.getManifest(releaseName, user)

  const role = roleManifest.getManifest(releaseName, user, userNamespace)
  const serviceaccount = serviceaccountManifest.getManifest(releaseName, user, userNamespace)
  const rolebinding = rolebindingManifest.getManifest(releaseName, user, namespace, userNamespace)

  const secret = secretManifest.getManifest(releaseName, user, "")
  const deployment = deploymentManifest.getManifest(releaseName, user, userNamespace)
  const service = serviceManifest.getManifest(releaseName, user)
  const ingressroute = ingressrouteManifest.getManifest(releaseName, user, "", "", "")

  try {
    var allManifestsFound = false
    var status
    var link

    try {
      await kubernetes.client().api.v1.namespaces(namespace).pvc(pvc.metadata.name).get()

      await kubernetes.client().api.v1.namespaces(namespace).serviceaccount(serviceaccount.metadata.name).get()
      await kubernetes.client().apis['rbac.authorization.k8s.io'].v1.namespaces(userNamespace).role(role.metadata.name).get()
      await kubernetes.client().apis['rbac.authorization.k8s.io'].v1.namespaces(userNamespace).rolebinding(rolebinding.metadata.name).get()

      await kubernetes.client().api.v1.namespaces(namespace).secret(secret.metadata.name).get()
      await kubernetes.client().apis.apps.v1.namespaces(namespace).deployments(deployment.metadata.name).get()
      await kubernetes.client().api.v1.namespaces(namespace).service(service.metadata.name).get()
      await kubernetes.client().apis['traefik.containo.us'].v1alpha1.namespaces(namespace).ingressroute(ingressroute.metadata.name).get()

      allManifestsFound = true
    } catch (e) {
      allManifestsFound = false
    }

    if(allManifestsFound) {
      try {
        var editor = await kubernetes.client().apis.apps.v1.namespaces(namespace).deployments(deployment.metadata.name).get()

        if(editor.body.spec.replicas == 1) {
          status = "running"
          link = 'https://' + editorDomain
        } else{
          status = "stopped"
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      status = "missing"
    }
    
    return { 
      "status": "successfull",
      "editor": {
        "status": status,
        link
      }
    }
  } catch (e) {
    return { "status": "failed" }
  }
}

async function startEditor(releaseName, user, namespace) {
  user = user.replace('.', '-')
  const deployment = deploymentManifest.getManifest(releaseName, user, "")

  try {
    const replica = {
      spec: {
        replicas: 1
      }
    }

    await kubernetes.client().apis.apps.v1.namespaces(namespace).deployments(deployment.metadata.name).patch({ body: replica })
    
    return { "status": "successfull" }
  } catch (e) {
    console.log(e)
    return { "status": "failed" }
  }
}

async function stopEditor(releaseName, user, namespace) {
  user = user.replace('.', '-')
  const deployment = deploymentManifest.getManifest(releaseName, user, "")

  try {
    const replica = {
      spec: {
        replicas: 0
      }
    }

    await kubernetes.client().apis.apps.v1.namespaces(namespace).deployments(deployment.metadata.name).patch({ body: replica })
    
    return { "status": "successfull" }
  } catch (e) {
    console.log(e)
    return { "status": "failed" }
  }
}

async function changePassword(releaseName, user, namespace, password) {
  user = user.replace('.', '-')
  const secret = secretManifest.getManifest(releaseName, user, "")

  try {
    const replica = {
      stringData: {
        password: password
      }
    }

    await kubernetes.client().api.v1.namespaces(namespace).secret(secret.metadata.name).patch({ body: replica })
    
    return { "status": "successfull" }
  } catch (e) {
    console.log(e)
    return { "status": "failed" }
  }
}

module.exports = {
  createEditor,
  deleteEditor,
  startEditor,
  stopEditor,
  getStatus,
  changePassword
}