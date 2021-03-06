'use strict';

module.exports = {
    extends: [ 'standard' ],
    globals: {
        q: true,
        _: true,
        log: true,
        PATH: true
    },
    env: {
        es6: true,
        node: true
    },
    rules: {
        indent: [ 'error', 4 ],
        semi: [ 'error', 'always' ],
        'no-multi-spaces': 0
    }
};
