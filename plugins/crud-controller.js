'use strict';

module.exports = class CrudController {
    constructor (app, DAO) {
        const json = new app.views.Json();

        this.Error = app.plugins.Error;
        this.DAO = DAO;
        this.Filter = app.plugins.FilterMongoose;
        this.promise = json.promise.bind(json);
    }

    static fetchId (request) {
        return request.params.id === 'me'
            ? request.user._id
            : request.params.id;
    }

    async list (request, response, next) {
        let dao = new this.DAO();
        let filter = new this.Filter(request.query);

        response.header('X-Count', await dao.count(filter));
        return this.promise(dao.list(filter), response, next);
    }

    find (request, response, next) {
        const id = CrudController.fetchId(request);
        return this.promise(new this.DAO()
            .find(id), response, next);
    }

    insert (request, response, next) {
        return this.promise(new this.DAO()
            .insert(request.body), response, next, 201);
    }

    modify (request, response, next) {
        const id = CrudController.fetchId(request);
        return this.promise(new this.DAO()
            .modify(id, request.body), response, next);
    }

    delete (request, response, next) {
        const id = CrudController.fetchId(request);
        return this.promise(new this.DAO()
            .delete(id), response, next, 204);
    }
};
