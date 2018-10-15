'use strict';

const Bool = require('booljs');

// Here is where magic happens
module.exports = (async () => {
    try {
        return new Bool('com.example.api', [
            'booljs.express',

            'mongoose', 'booljs.mongoose', 'bcrypt', 'crypto', 'lodash',
            'mongoose-deep-populate', 'mongoose-hidden',
            'moment', 'es-promisify',

            'booljs.passport', 'booljs.oauth2',
            'passport-http', 'passport-http-bearer',
            'passport-oauth2-client-password'
        ]).setDatabaseDrivers('booljs.mongoose').run();
    } catch (error) {
        console.error(error);
    }
})();
