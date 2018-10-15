'use strict';

module.exports = function (app) {
    class TokenDao extends app.plugins.CrudDao {
        constructor () {
            super(app.models.Token);
        }

        async insert (user, client) {
            return this.model.insert({ user: user, client: client });
        };

        find (access, expired) {
            return this.model.findToken(access, expired || false);
        }

        refresh (refresh) {
            return this.model.refresh(refresh);
        }

        expire (id) {
            return this.model.expire(id);
        }
    }

    return new TokenDao();
};
