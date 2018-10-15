'use strict';

module.exports = function (app) {
    return new app.plugins.CrudDao(app.models.Role);
};
