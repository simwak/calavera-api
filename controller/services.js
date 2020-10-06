const express = require('express')
const keycloak = require('../modules/keycloak.js').get()
const config = require('../modules/config.js').get()

var router = express.Router()

// Get status information for the editor
router.get('/', keycloak.enforcer({response_mode: 'token'}), async (req, res) => {
  var services = [
    {
      'enabled': true,
      'name': 'GitLab',
      'logo': '/gitlab-logo.png',
      'description': 'From project planning and source code management to CI/CD and monitoring, GitLab is a complete DevOps platform, delivered as a single application.',
      'link': 'https://' + config.domains.gitlab
    },
    {
      'enabled': true,
      'name': 'Gitea',
      'logo': '/gitea-logo.png',
      'description': 'Gitea is a community managed lightweight code hosting solution written in Go. It is published under the MIT license.',
      'link': 'https://' + config.domains.gitea
    },
    {
      enabled: true,
      'name': 'Jenkins',
      'logo': '/jenkins-logo.png',
      'description': 'The leading open source automation server, Jenkins provides hundreds of plugins to support building, deploying and automating any project.',
      'link': 'https://' + config.domains.jenkins
    },
    {
      'enabled': true,
      'name': 'Mattermost',
      'logo': '/mattermost-logo.png',
      'description': 'Mattermost is a flexible, open source messaging platform that enables secure team collaboration.',
      'link': 'https://' + config.domains.mattermost
    },
    {
      'enabled': true,
      'name': 'Nexus',
      'logo': '/nexus-logo.png',
      'description': 'The free artifact repository with universal format support.',
      'link': 'https://' + config.domains.nexus
    },
    {
      'enabled': false,
      'name': 'OpenProject',
      'logo': '/openproject-logo.png',
      'description': 'OpenProject is a web-based project management system for location-independent team collaboration.',
      'link': 'https://' + config.domains.openproject
    },
    {
      'enabled': true,
      'name': 'Keycloak',
      'logo': '/keycloak-logo.png',
      'description': 'Keycloak is an open source Identity and Access Management solution aimed at modern applications and services.',
      'link': 'https://' + config.domains.keycloak
    }]
  
  res.send(services)
})

module.exports = router