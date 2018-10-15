'use strict';

module.exports = class Error {
    constructor (app, status, code) {
        const { groupBy } = app.utilities.Lodash;

        const errors = groupBy(app.configuration.get('errors'), 'status');
        const error = errors[status].find(error => error.code === code);

        return new app.Error(status, code, error.message, error.uri || null);
    }
};
