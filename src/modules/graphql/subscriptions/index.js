const fs = require('fs');
const path = require('path');

module.exports.newMessageSended = fs.readFileSync(path.join(__dirname, 'newMessageSended.gql'), 'utf8');
