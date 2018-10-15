'use strict';

module.exports = function (app) {
    class UserDao extends app.plugins.CrudDao {
        constructor () {
            super(app.models.User);
        }

        findMail (mail) {
            return this.model.one({ mail });
        }

        async login (mail, password) {
            const user = await this.findMail(mail);
            return user.login(password);
        }
    }

    return new UserDao();
};
