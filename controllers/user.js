'use strict';

module.exports = function (app) {
    return new app.plugins.CrudController(app.dao.User);
};
