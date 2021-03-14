const fs = require('fs');
const path = require('path');

<<<<<<< HEAD:src/modules/graphql/mutations/index.js
module.exports.sendMessage = fs.readFileSync(path.join(__dirname, 'sendMessage.gql'), 'utf8');
module.exports.createDirectConversation = fs.readFileSync(path.join(__dirname, 'createDirectConversation.gql'), 'utf8');
module.exports.createGroupConversation = fs.readFileSync(path.join(__dirname, 'createGroupConversation.gql'), 'utf8');
module.exports.deleteDirectConversation = fs.readFileSync(path.join(__dirname, 'deleteDirectConversation.gql'), 'utf8');
module.exports.deleteGroupConversation = fs.readFileSync(path.join(__dirname, 'deleteGroupConversation.gql'), 'utf8');
=======
>>>>>>> 7fe3bd454c20bc492bb571134790a68fceba718e:src/graphql/mutations/index.js
module.exports.login = fs.readFileSync(path.join(__dirname, 'login.gql'), 'utf8');
module.exports.logout = fs.readFileSync(path.join(__dirname, 'logout.gql'), 'utf8');
module.exports.register = fs.readFileSync(path.join(__dirname, 'register.gql'), 'utf8');
