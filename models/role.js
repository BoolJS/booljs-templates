'use strict';

const _ = require('underscore');
const MongooseModel = require('booljs.mongoose/model');

module.exports = class RoleModel extends MongooseModel {
    constructor (app, { Schema }) {
        const { FilterJoin } = app.plugins;
        const modelsList = new app.plugins.ModelsFetch(app.models);
        const permissionsList = app.configuration.get('permissions');

        let permissionsEnumeration = new FilterJoin(
            modelsList,
            new FilterJoin(permissionsList, ['', 'Me']).map(x => x.join(''))
        ).map(x => x.join(':'));

        var roleSchema = new Schema({
            _id: {
                type: String,
                required: true
            },
            permissions: [{
                type: String,
                enum: permissionsEnumeration
            }],
            createdAt: {
                required: true,
                type: Date,
                default: Date.now
            },
            updatedAt: {
                required: true,
                type: Date,
                default: Date.now
            }
        });

        roleSchema.path('permissions').set(function (permissions) {
            var definitivePermissions = [];
            for (let permission of permissions) {
                let permissionRegex = new RegExp(
                    `${permission.replace('*', '.*')}$`
                );

                definitivePermissions.push(permissionsEnumeration.filter(
                    x => permissionRegex.test(x)
                ));
            }
            return _.chain(definitivePermissions).flatten().uniq().value();
        });

        roleSchema.pre('save', function (next) {
            if (!this.isNew) {
                this.updatedAt = Date.now();
            }
            next();
        });

        roleSchema
            .plugin(new app.plugins.CrudMongoose(), { customId: true });

        super(roleSchema);
    }
};
