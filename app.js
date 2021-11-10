require('dotenv-flow').config()
// const ip = require('ip')
const ovh = require('ovh')

console.log('OVH_APP_KEY', process.env.OVH_APP_KEY)
console.log('OVH_SECRET_KEY', process.env.OVH_SECRET_KEY)
console.log('OVH_CONSUMER_KEY', process.env.OVH_CONSUMER_KEY)
console.log('OVH_ZONE', process.env.OVH_ZONE)

// const ipAddress = ip.address()
const ovhInstance = ovh({
  endpoint: 'ovh-eu',
  appKey: process.env.OVH_APP_KEY,
  appSecret: process.env.OVH_SECRET_KEY,
  consumerKey: process.env.OVH_CONSUMER_KEY
})

ovhInstance.requestPromised('GET', '/domain/zone/{zoneName}/dynHost/record', {
  zoneName: process.env.OVH_ZONE
}).then(response => {
  console.log('success', response)
}).catch(error => {
  console.error('error', error)
})
