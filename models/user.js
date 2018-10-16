'use strict';

const MongooseModel = require('booljs.mongoose/model');

module.exports = class UserModel extends MongooseModel {
    constructor (app, { Schema, connection }) {
        const { Error, CrudMongoose } = app.plugins;
        const { Bcryptjs, EsPromisify } = app.utilities;
        const { Mongoose, MongooseDeepPopulate, MongooseHidden } =
            app.utilities;

        const userSchema = new Schema({
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String
            },
            mail: {
                type: String,
                required: true,
                index: { unique: true }
            },
            roles: [{
                type: String,
                ref: 'Role'
            }],
            password: {
                type: String,
                required: true,
                hide: true
            },
            phone: String,
            mobile: String
        }, { timestamps: true });

        userSchema
            .plugin(new MongooseHidden(), { hidden: { _id: false } })
            .plugin(new MongooseDeepPopulate(Mongoose))
            .plugin(new CrudMongoose(), { customId: true });

        userSchema.pre('validate', async function (next) {
            const User = connection.models.User;

            try {
                const { _id, mail } = this;

                let user;
                try {
                    user = await User.one({ $or: [ { _id }, { mail } ] });
                } catch (_) {
                    user = undefined;
                }

                if (this.isNew && user !== undefined && user !== null) {
                    if (this.mail === user.mail) {
                        throw new Error(400, 'E_DUPLICATED_MAIL');
                    } else {
                        throw new Error(400, 'E_DUPLICATED_ID');
                    }
                }

                await this.hashPassword();
                next();
            } catch (error) {
                next(error);
            }
        });

        userSchema.static.one = async function (query, fields, options) {
            const object = await this.validateQuery(() =>
                this.findOne(query, fields, options)
                    .deepPopulate('roles')
                    .exec());

            if (object === undefined || object === null) {
                throw new Error(404, 'E_NOT_FOUND');
            }

            return object;
        };

        super(userSchema);
        this.BCrypt = {
            compare: EsPromisify(Bcryptjs.compare, Bcryptjs),
            genSalt: EsPromisify(Bcryptjs.genSalt, Bcryptjs),
            hash: EsPromisify(Bcryptjs.hash, Bcryptjs)
        };
    }

    static list (query, fields, options) {
        return this.validateQuery(() => this.find(query, fields, options)
            .deepPopulate('roles')
            .exec());
    };

    async hashPassword () {
        const { BCrypt: { genSalt, hash } } = this;

        if (this.isModified('password')) {
            return genSalt().then(salt => hash(this.password, salt))
                .then(hash => (this.password = hash));
        }
    };

    async login (password) {
        return this.BCrypt.compare(password, this.password);
    };
};
