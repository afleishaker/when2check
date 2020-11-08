const admin = require('firebase-admin');
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true })
const create = require('./create');
const notify = require('./notify');
exports.createEvent = create.createEvent;
exports.createUser = create.createUser;
exports.availbility = notify.availability;