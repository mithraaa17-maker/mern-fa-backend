const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_xmpp-server._tcp.google.com', (err, records) => {
  console.log('Error:', err);
  console.log('Records:', records);
});