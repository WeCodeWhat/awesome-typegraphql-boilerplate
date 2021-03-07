const fs = require('fs');
const path = require('path');

module.exports.getConversation = fs.readFileSync(path.join(__dirname, 'getConversation.gql'), 'utf8');
module.exports.getConversations = fs.readFileSync(path.join(__dirname, 'getConversations.gql'), 'utf8');
module.exports.me = fs.readFileSync(path.join(__dirname, 'me.gql'), 'utf8');
module.exports.hello = fs.readFileSync(path.join(__dirname, 'hello.gql'), 'utf8');
