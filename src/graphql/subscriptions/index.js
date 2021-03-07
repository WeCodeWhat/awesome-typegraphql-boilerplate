const fs = require('fs');
const path = require('path');

module.exports.newConversationMessageAdded = fs.readFileSync(path.join(__dirname, 'newConversationMessageAdded.gql'), 'utf8');
