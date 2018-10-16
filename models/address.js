'use strict';

const MongooseModel = require('booljs.mongoose/model');

module.exports = class AddressModel extends MongooseModel {
    constructor (app, { Schema }) {
        const addressSchema = new Schema({
            line1: {
                type: String,
                required: true
            },
            line2: String,
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            geolocation: {
                type: Schema.Types.Point,
                required: true
            }
        });

        addressSchema.index({ geolocation: '2dsphere' });
        addressSchema.plugin(new app.plugins.CrudMongoose());

        super(addressSchema);
    }
};
