'use strict';

module.exports = {
    extends: [ 'standard' ],
    globals: {
        q: true,
        _: true,
        log: true,
        PATH: true,
        Agent: true,
        expect: true,
        assert: true
    },
    env: {
        es6: true,
        node: true,
        mocha: true
    },
    rules: {
        indent: [ 'error', 4 ],
        semi: [ 'error', 'always' ],
        'no-multi-spaces': 0
    }
};
