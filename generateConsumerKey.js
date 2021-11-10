require('dotenv-flow').config()
const ovh = require('ovh')

console.log('OVH_APP_KEY', process.env.OVH_APP_KEY)
console.log('OVH_SECRET_KEY', process.env.OVH_SECRET_KEY)

const ovhInstance = ovh({
  endpoint: 'ovh-eu',
  appKey: process.env.OVH_APP_KEY,
  appSecret: process.env.OVH_SECRET_KEY
})

ovhInstance.requestPromised('POST', '/auth/credential', {
  'accessRules': [
    { 'method': 'GET', 'path': '/*'},
    { 'method': 'POST', 'path': '/*'},
    { 'method': 'PUT', 'path': '/*'},
    { 'method': 'DELETE', 'path': '/*'}
  ]
}).then(credential => {
  console.log('credential', credential)
}).catch(err => {
  console.error('error', err)
})
