const { Client } = require('kubernetes-client')

var initialized = false
var client

function init() {
  (async function() {
    if(!initialized) {
      try {
      console.log("Initializing Kubernetes Client...")
        client = new Client()
  
        await client.loadSpec()
        await initCrds()
  
        initialized = true
      } catch (e) {
        console.log(e)
      }
    }
  }());
}

async function initCrds() {
  try {
    console.log("Initializing Kubernetes Custom Ressource Definitions...")
    const middlewareCrd = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions('middlewares.traefik.containo.us').get()
    const ingressrouteCrd = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions('ingressroutes.traefik.containo.us').get()

    await client.addCustomResourceDefinition(middlewareCrd.body)
    await client.addCustomResourceDefinition(ingressrouteCrd.body)
  } catch (e) {
    console.log(e)
  }
}

function client() {
  return client
}

module.exports = {
  init,
  client
}