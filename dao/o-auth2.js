'use strict';

module.exports = class OAuth2DAO {
    constructor (app) {
        const { Token, User } = app.dao;
        Object.assign(this, { Token, User });
    }

    token (server, OAuth2) {
        const { Token, User } = this;

        server.exchange(OAuth2.exchange.password(
            async (client, mail, password, scope, done) => {
                try {
                    const user = await new User().findMail(mail);
                    const login = user !== undefined
                        ? await user.login(password)
                        : false;
                    const token = login !== undefined
                        ? await new Token().insert(user.id, client.id)
                        : false;

                    done(null, token.access || false, token.refresh || false,
                        token !== undefined
                            ? { scope: user.permissions || false }
                            : false);
                } catch (error) {
                    log.debug(error);
                    done(error);
                }
            }
        ));

        server.exchange(OAuth2.exchange.refreshToken(
            (client, refreshToken, scope, done) => (
                new Token().refresh(refreshToken).then(
                    token => done(null, token.access || false, token.refresh)
                ).catch(done)
            )
        ));
    };
};
