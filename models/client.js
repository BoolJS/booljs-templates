'use strict';

const MongooseModel = require('booljs.mongoose/model');

module.exports = class ClientModel extends MongooseModel {
    constructor (app, { Schema }) {
        const { Crypto } = app.utilities;

        const clientSchema = new Schema({
            name: {
                type: String,
                required: true
            },
            description: String,
            secret: {
                type: String,
                required: true,
                default: () => Crypto.randomBytes(32).toString('base64')
            },
            redirectUri: String
        });

        clientSchema.plugin(new app.plugins.CrudMongoose());

        super(clientSchema);
    }

    matchesSecret (secret) {
        return this.secret === secret ? this : null;
    }
};
