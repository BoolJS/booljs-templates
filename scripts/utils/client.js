'use strict';

const add = require('../test/add');

require('../..').then(api => api.app).then(async app => {
    const client = await add(app, 'client');
    log.debug(client);
    process.exit(0);
});
