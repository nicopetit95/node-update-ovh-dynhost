require('colors')
require('dotenv-flow').config({
  path: __dirname
})
const ovh = require('ovh')
const { exec } = require('child_process')
const ip = require('ip')

console.log(`OVH_APP_KEY`.blue, process.env.OVH_APP_KEY)
console.log(`OVH_SECRET_KEY`.blue, process.env.OVH_SECRET_KEY)
console.log(`OVH_CONSUMER_KEY`.blue, process.env.OVH_CONSUMER_KEY)
console.log(`OVH_DOMAIN`.blue, process.env.OVH_DOMAIN)
console.log(`OVH_SUBDOMAIN`.blue, process.env.OVH_SUBDOMAIN)

const run = async ipAddress => {
  try {
    // Instance of OVH API
    const ovhInstance = ovh({
      endpoint: 'ovh-eu',
      appKey: process.env.OVH_APP_KEY,
      appSecret: process.env.OVH_SECRET_KEY,
      consumerKey: process.env.OVH_CONSUMER_KEY
    })
    // Get records
    const records = await ovhInstance.requestPromised('GET', '/domain/zone/{zoneName}/dynHost/record', {
      zoneName: process.env.OVH_DOMAIN,
      ...(!!process.env.OVH_SUBDOMAIN ? { subDomain: process.env.OVH_SUBDOMAIN } : {})
    })
    // If records ?
    if (records && records.length > 0) {
      // Convert ipAddress to long to be compared
      const ipAddressLong = ip.toLong(ipAddress)
      console.log(`IpAddress`.blue, ipAddress)
      // For every record we'll check the actual ip and update if needed
      for (let recordId of records) {
        // Get record informations
        const record = await ovhInstance.requestPromised('GET', '/domain/zone/{zoneName}/dynHost/record/{id}', {
          zoneName: process.env.OVH_DOMAIN,
          id: recordId
        })
        // Key of the record (subdomain + domain)
        const key = `${record.subDomain}.${record.zone}`
        // If update needed
        if (ip.toLong(record.ip) !== ipAddressLong) {
          await ovhInstance.requestPromised('PUT', '/domain/zone/{zoneName}/dynHost/record/{id}', {
            zoneName: record.zone,
            id: record.id,
            ip: ipAddress
          })
          console.log(`Record ${key} was updated`.green)
        } else {
          console.log(`No update needed for record ${key}`.yellow)
        }
      }
    } else {
      console.log(`No record found for ${process.env.OVH_SUBDOMAIN || '*'}.${process.env.OVH_DOMAIN}`.yellow)
    }
  } catch (err) {
    console.error(`Unhandled error`.red, error)
  }
}

// Call to ifconfig.me to get the public ipv4 address
exec("curl ifconfig.me", (error, stdout) => {
  if (error) {
    console.error(`Error retrieving ip address`.red, error)
    process.exit(1)
  } else {
    run(stdout).then(() => {
      console.log(`Update process completed`.green)
      process.exit(0)
    }).catch(() => {
      console.error(`Update process failed`.red)
      process.exit(1)
    })
  }
})
