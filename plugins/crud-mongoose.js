'use strict';

module.exports = function (app) {
    const { Error } = app.plugins;

    return function (Schema, options) {
        Schema.statics.getCount = function (filter) {
            return this.count(filter).exec();
        };

        Schema.statics.list = function (query, fields, projection) {
            return this.find(query, fields, projection).exec();
        };

        Schema.statics.one = async function (query, fields, projection) {
            const object = await this.findOne(query, fields, projection).exec();

            if (object === undefined || object === null) {
                throw new Error(404, 'E_NOT_FOUND');
            }

            return object;
        };

        Schema.statics.findId = function (_id) {
            return this.one({ _id });
        };

        Schema.statics.insert = async function (object) {
            if (object._id !== undefined && options.customId === undefined) {
                throw new Error(400, 'E_INVALID_ID_FIELD');
            }

            let response = await this.create(object);
            return this.findId(response._id);
        };

        Schema.statics.modify = async function (_id, data) {
            let object = await this.one({ _id });

            _.chain(data).omit([
                '__v', '_id'
            ]).mapObject((value, key) => (object[key] = value));

            await object.save();
            return this.findId(_id);
        };

        Schema.statics.delete = async function (_id) {
            return (await this.one({ _id })).remove();
        };
    };
};
