// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

const express = require('express')
const session = require('express-session')
const cors = require('cors')

const ldap = require('./modules/ldap.js')
const kubernetes = require('./modules/kubernetes.js')
const keycloak = require('./modules/keycloak.js')

ldap.init()
kubernetes.init()
 
const app = express()
const sessionSecret = 'some secret'

var memoryStore = new session.MemoryStore()
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: true, store: memoryStore }))

keycloak.init(memoryStore)

app.use(cors())
app.use(keycloak.get().middleware())
app.use(express.json())

app.use('/user', require('./controller/user.js'))
app.use('/editor', require('./controller/editor.js'))
app.use('/services', require('./controller/services.js'))
app.use('/config', require('./controller/config.js'))

app.get('/', function(req, res) {
   res.send({ "status": "Service is up and running" })
})

console.log("Starting to listen on port 8080...")
app.listen(8080)