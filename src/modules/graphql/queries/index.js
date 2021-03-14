const fs = require('fs');
const path = require('path');

module.exports.getConversation = fs.readFileSync(path.join(__dirname, 'getConversation.gql'), 'utf8');
module.exports.getConversations = fs.readFileSync(path.join(__dirname, 'getConversations.gql'), 'utf8');
module.exports.me = fs.readFileSync(path.join(__dirname, 'me.gql'), 'utf8');
module.exports.getUser = fs.readFileSync(path.join(__dirname, 'getUser.gql'), 'utf8');
module.exports.getUsers = fs.readFileSync(path.join(__dirname, 'getUsers.gql'), 'utf8');
