'use strict';

const test = require('../test');

process.env.NODE_ENV = process.env.NODE_ENV || 'local';
require('../..').then(async API => {
    await test(API);
    process.exit(0);
});
