'use strict';

module.exports = function (app) {
    class ClientDao extends app.plugins.CrudDao {
        constructor () {
            super(app.models.Client);
        }

        async find (id, secret) {
            const client = await this.model.findId(id);
            return client.matchesSecret(secret);
        }
    }

    return new ClientDao();
};
