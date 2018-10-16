'use strict';

const clear = require('./clear');
const add = require('./add');

module.exports = async (api, doClear = true) => {
    const app = api.app;

    // Clearing database information
    if (doClear) {
        await clear(app);
    }
    // Adding client
    await add(app, 'client');

    // Adding roles & users
    await add(app, 'role', 'admin', [ '*' ]);
    await add(app, 'role', 'user', [ 'user:*Me' ]);
    await add(app, 'user', 'admin');

    return app;
};
