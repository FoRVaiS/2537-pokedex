const http = require('http');

const config = require('config');

const { createExpressInstance } = require('./server/server');

const address = config.get('address');
const port = config.get('port');

(async () => {
  const server = http.createServer(await createExpressInstance());
  
  server.listen(port, address, err => {
    if (err) return console.error(err);
  
    console.log(`Server started on ${address}:${port}`);

    return null;
  });
})();
