'use strict';

module.exports = class CRUD {
    constructor (app, Model) {
        this.model = new Model();
    }

    count ({ query } = {}) {
        return this.model.getCount(query);
    }

    list ({ query, fields, options } = {}) {
        return this.model.list(query, fields, options);
    }

    find (id) {
        return this.model.findId(id);
    }

    findOne ({ query, fields, options } = {}) {
        return this.model.findOne(query, fields, options).exec();
    }

    insert (object) {
        return this.model.insert(object);
    }

    modify (id, object) {
        return this.model.modify(id, object);
    }

    delete (id) {
        return this.model.delete(id);
    }
};
