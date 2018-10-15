'use strict';

const faker = require('faker');

function generatePoint (origin = [0, 0], radius = 1000) {
    let [lng, lat] = origin;

    let w = radius / 111300 * Math.sqrt(Math.random());
    let v = Math.random();

    let x = w * Math.cos(2 * Math.PI * v);
    let y = w * Math.sin(2 * Math.PI * v);

    x /= Math.cos(lat);

    return [lng + x, lat + y];
}

module.exports = (coords, maxDistance) => ({
    line1: faker.address.streetAddress(),
    line2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    country: faker.address.countryCode(),
    geolocation: {
        type: 'Point',
        coordinates: generatePoint(coords, maxDistance)
    }
});
