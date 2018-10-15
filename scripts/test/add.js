'use strict';

const mock = {
    address: require('../mock/address'),
    client: require('../mock/client'),
    user: require('../mock/user')
};

class TestAdd {
    constructor (app) { this.app = app; }
    address (origin, radius, extra) {
        return new this.app.dao.Address()
            .insert({ ...mock.address(origin, radius), ...extra });
    }

    client (extra) {
        return new this.app.dao.Client()
            .insert({ ...mock.client(), ...extra });
    }

    role (_id, permissions = []) {
        return new this.app.dao.Role()
            .insert({ _id, permissions });
    }

    user (role, extra) {
        return new this.app.dao.User()
            .insert({ ...mock.user(role), ...extra });
    }
}

module.exports = (app, model, ...args) => new TestAdd(app)[model](...args);
