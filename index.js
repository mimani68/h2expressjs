const spdy = require('spdy');
const express = require('express');
const fs = require('fs'); 

const PORT = 3050;
// 
// C R E A T E
// L E T'S 
// E N C R Y P T
// C E R T I F I C A T I O N
// 
// https://letsencrypt.org/docs/certificates-for-localhost/
// 
// openssl req -x509 -out localhost.crt -keyout localhost.key \
//   -newkey rsa:2048 -nodes -sha256 \
//   -subj '/CN=localhost' -extensions EXT -config <( \
//    printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
// 

const app = express();

app.get('/ping', (req, res) => {
    res.json({
      status: 'active',
      framework: 'express.js',
      http_protocol: 'http2'
    });
});

const option = {
  key: fs.readFileSync(__dirname + '/localhost.key'),
  cert: fs.readFileSync(__dirname + '/localhost.crt'),
  spdy: {
    protocols: [ 'h2', 'spdy/3.1', 'http/1.1' ],
    plain: false,
    'x-forwarded-for': true,
    connection: {
      windowSize: 1024 * 1024,
      autoSpdy31: false
    }
  }
}

spdy
  .createServer(option, app)
  .listen(PORT, (err) => {
      if (err) {
          throw new Error(err);
      }
      console.log('Listening on port: ' + PORT + '.');
  });