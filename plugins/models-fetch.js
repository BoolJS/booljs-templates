'use strict';

const _ = require('underscore');

function fetchModels (app, obj) {
    const keys = Object.keys(obj).map(key => typeof obj[key] === 'function'
        ? key.toLowerCase()
        : fetchModels(app, obj[key]));
    return _.flatten(keys);
};

module.exports = fetchModels;
