'use strict';

const MongooseModel = require('booljs.mongoose/model');

module.exports = class TokenModel extends MongooseModel {
    constructor (app, { Schema }) {
        const { Crypto, Moment } = app.utilities;
        const { Error, CrudMongoose } = app.plugins;
        const security  = app.configuration.get('security');

        const tokenSchema = new Schema({
            user: {
                type: String,
                ref: 'User',
                required: true,
                index: true
            },
            client: {
                type: Schema.Types.ObjectId,
                ref: 'Client',
                required: true,
                index: true
            },
            expires: {
                type: Date,
                required: true,
                default: () => Moment().add(security.token.expiresIn, 'seconds')
            },
            access: {
                type: String,
                required: true,
                default: () => Crypto.randomBytes(64).toString('base64')
            },
            refresh: {
                type: String,
                required: true,
                default: () => Crypto.randomBytes(64).toString('base64')
            },
            createdAt: {
                type: Date,
                required: true,
                default: Date.now
            }
        });

        tokenSchema.plugin(new CrudMongoose());

        tokenSchema.statics.refresh = async function (refresh) {
            let token = await this.findOne({ refresh: refresh }).exec();

            if (token === undefined || token === null) {
                throw new Error(401, 'invalid_grant');
            } else {
                return this.insert({ user: token.user, client: token.client });
            }
        };

        super(tokenSchema);
    }

    static findToken (access, expired) {
        return this.findOne({
            access: access,
            expires: { [expired ? '$lte' : '$gte']: new Date() }
        }).exec();
    };

    static expire (id) {
        return this
            .findOneAndUpdate({ _id: id }, { expires: new Date() })
            .exec();
    };
};
