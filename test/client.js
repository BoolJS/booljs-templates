'use strict';

describe('Client', () => {
    const Bool = require('booljs');
    const clear = require('../scripts/test/clear');
    const mock = require('../scripts/mock/client');

    describe('DAO', () => {
        let dao, id, secret;

        before(async () => {
            const { app } = await new Bool('com.example.api').run();
            await clear(app);
            dao = new app.dao.Client();
        });

        let client;
        it('#insert', () => dao.insert((client = mock())).then(data => {
            id = data._id;
            secret = data.secret;
            expect(data.name).to.eql(client.name);
            expect(data.description).to.eql(client.description);
        }));

        it('#find', () => expect(
            dao.find(id, secret)
        ).to.eventually.have.property('secret', secret));

        it('#list', () => expect(dao.list()).to.eventually.have.length(1));

        it('#modify', () => expect(
            dao.modify(id, (client = mock()))
        ).to.eventually.have.property('name', client.name));

        it('#delete', () => dao.delete(id));
    });
});
