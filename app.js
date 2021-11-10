require('dotenv-flow').config()
const ip = require('ip')
const ovh = require('ovh')

console.log('OVH_APP_KEY', process.env.OVH_APP_KEY)
console.log('OVH_SECRET_KEY', process.env.OVH_SECRET_KEY)
console.log('OVH_CONSUMER_KEY', process.env.OVH_CONSUMER_KEY)

const ipAddress = ip.address()
const ovhInstance = ovh({
  endpoint: 'ovh-eu',
  appKey: process.env.OVH_APP_KEY,
  appSecret: process.env.OVH_SECRET_KEY,
  consumerKey: process.env.OVH_CONSUMER_KEY
})

console.log(ipAddress, ovhInstance)
