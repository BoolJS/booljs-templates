'use strict';

const _ = require('underscore');

module.exports = function (app, ...rest) {
    return _.reduce(rest, (a, b) => _.flatten(
        _.map(a, x => _.map(b, y => x.concat([y]))), true), [ [] ]
    );
};
