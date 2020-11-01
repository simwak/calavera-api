const LdapClient = require('ldapjs-client')
const configInternal = require('../modules/config.js').getInternal()

var client = new LdapClient({ url: configInternal.ldapUrl })

var initialized = false
var userAttributes = ['cn','sn','mail','uid','employeeNumber','memberOf']

function init() {
  (async function() {
    if(!initialized) {
      console.log("Initializing LDAP...")
      try {
        await client.bind(configInternal.bindDn, configInternal.bindCredentials)
        initialized = true
      } catch (e) {
        console.log('Bind failed');
      }
    }
  }());
}

async function getUser(uid) {
  try {
    const options = {
      filter: '(&(objectClass=inetOrgPerson)(uid=' + uid + '))',
      scope: 'sub',
      attributes: userAttributes
    }
  
    const entries = await client.search(configInternal.usersDn, options)
    return entries
  } catch (e) {
    console.log(e)
  }
}


async function getUsers() {
  try {
    const options = {
      filter: '(objectClass=inetOrgPerson)',
      scope: 'sub',
      attributes: userAttributes
    }
  
    const entries = await client.search(configInternal.usersDn, options)
    return entries
  } catch (e) {
    console.log(e)
  }
}

async function addUser(cn, sn, mail, uid, password) {
  try {
    const entry = {
      cn: cn,
      sn: sn,
      mail: mail,
      uid: uid,
      userPassword: password,
      openprojectAdmin: "true",
      objectclass: [
        "inetOrgPerson",
        "organizationalPerson",
        "openprojectAdmin",
        "giteaAdmin"
      ],
      employeeNumber: Math.floor(Math.random() * (9999999999999999999  - 2) ) + 2
    }
   
    await client.add('uid=' + uid + ',' + configInternal.usersDn, entry)
    
    const change = {
      operation: 'add',
      modification: {
        uniqueMember: 'uid=' + uid + ',' + configInternal.usersDn
      }
    }
   
    await client.modify('cn=nx-admin,' + configInternal.groupsDn, change)
    await client.modify('cn=administrator,' + configInternal.groupsDn, change)

    return { "status": "successful" }
  } catch (e) {
    console.log(e)
    return { "status": "failed" }
  }
}

async function deleteUser(uid) {
  try {
    await client.del('uid=' + uid + ',' + configInternal.usersDn)
    return { "status": "successful" }
  } catch (e) {
    console.log(e)
    return { "status": "failed" }
  }
}

async function changePassword(uid, password) {
  try {
    const change = {
      operation: 'replace',
      modification: {
        userPassword: password
      }
    }
   
    await client.modify('uid=' + uid + ',' + configInternal.usersDn, change)
    return { "status": "successful" }
  } catch (e) {
    console.log(e)
    return { "status": "failed" }
  }
}

module.exports = {
  init,
  getUser,
  getUsers,
  addUser,
  deleteUser,
  changePassword
}