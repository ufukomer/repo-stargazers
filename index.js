var port = process.env.PORT || 3000;
var fs = require('fs');

var tsconfig = fs.readFileSync('./tsconfig.json');
var config;

try {
  config = JSON.parse(tsconfig);
} catch (err) {
  console.error('An error occured while parsing tsconfig.');
  console.error(err);
}

require('ts-node').register(config);
require('./src/server/').listen(port, () => {
  console.info('Listening on port %s...', port);
});
