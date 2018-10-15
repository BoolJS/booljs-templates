'use strict';

describe('User', () => {
    const Bool = require('booljs');
    const mock = require('../scripts/mock/user');
    const test = require('../scripts/test');
    const login = require('../scripts/test/login');

    describe('DAO', () => {
        let dao, id, mail, password, user;

        before(async () => {
            const app = await new Bool('com.example.api')
                .run().then(test);
            await new Promise((resolve, reject) =>
                new app.models.User().collection.deleteMany({}, resolve));
            dao = new app.dao.User();
        });

        it('#insert', async () => {
            user = mock('user');
            mail = user.mail;
            password = user.password;
            expect(await dao.insert(user)).to.have.property('password');
        });

        it('#list', () => expect(dao.list()).to.eventually.have.length(1));

        it('#findMail', () => dao.findMail(mail)
            .then(user => (id = user._id)));

        it('#modify', () => expect(dao.modify(id, {
            mail: (mail = 'new@example.com'),
            password: (password = 'sample1t')
        })).to.eventually.have.property('mail', mail));

        it('#login', () => expect(
            dao.login(mail, password)
        ).to.eventually.be.ok);

        it('#delete', () => dao.delete(id));
    });

    describe('Controller', () => {
        let agent, admin, client, token;

        before(async () => {
            const API = await new Bool('com.example.api').run();
            const app = await test(API);

            agent = new Agent(API.server);
            admin = await login(app, 'admin');
            [ client ] = await new app.models.Client().list();
        });

        let user = mock();

        it('POST /users', () => (agent
            .post('/users')
            .auth(client._id.toString(), client.secret)
            .send(user)
        ).expect(201));

        it('GET /users', () => expect((agent
            .get('/users')
            .set('Authorization', admin)
            .expect(200)
        ).then((res) => res.body.data)).to.eventually.have.length(2));

        it('POST /auth/token', () => (agent
            .post('/auth/token')
            .type('form')
            .send({
                grant_type: 'password',
                client_id: client._id.toString(),
                client_secret: client.secret,
                username: user.mail,
                password: user.password
            })
            .expect(200)
        ).then(({ body }) => (token = `Bearer ${body.access_token}`)));

        it('GET /users/me', () => expect((agent
            .get('/users/me')
            .set('Authorization', token)
            .expect(200)
        ).then(res => res.body.data)).to.eventually.have.property(
            'firstName', user.firstName
        ));

        it('PUT /users/me', () => expect((agent
            .put('/users/me')
            .set('Authorization', token)
            .send({ lastName: '', mail: 'john.doe@example.com' })
            .expect(200)
        ).then(res => res.body.data)).to.eventually.have.property(
            'lastName', ''
        ));

        it('DELETE /users/me', () => agent
            .delete('/users/me')
            .set('Authorization', token)
            .expect(204));
    });
});
