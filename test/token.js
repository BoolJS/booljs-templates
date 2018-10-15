'use strict';

describe('Token', () => {
    const Bool = require('booljs');
    const test = require('../scripts/test');

    describe('DAO', () => {
        let dao, user, client, token;

        before(async () => {
            const app = await await new Bool('com.example.api')
                .run().then(test);
            dao = new app.dao.Token();
            [ user ] = await new app.dao.User().list();
            [ client ] = await new app.dao.Client().list();
        });

        it('#insert', async () => expect(
            token = await dao.insert(user._id, client._id)
        ).to.be.ok);

        it('#find', () => expect(
            dao.find(token.access)
        ).to.eventually.have.property('refresh', token.refresh));

        it('#list', () => expect(dao.list()).to.eventually.have.length(1));

        it('#refresh', async () => expect(
            (await dao.refresh(token.refresh)).user.toString()
        ).to.eql(token.user.toString()));

        it('#expire', () => expect(dao.expire(token._id)).to.eventually.be.ok);
    });
});
