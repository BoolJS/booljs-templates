'use strict';

module.exports = class PassportDAO {
    constructor (app) {
        const { PassportHttp, PassportHttpBearer } = app.utilities;
        const { PassportOauth2ClientPassword } =
            app.utilities;
        const { Client, Token, User } = app.dao;

        Object.assign(this, {
            ...{ Client, Token, User },
            ...{ PassportHttp, PassportHttpBearer },
            PassportOauth2ClientPassword
        });
    }

    bearer (passport) {
        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user));

        const { PassportHttpBearer, Token, User } = this;

        return new PassportHttpBearer.Strategy(async (accessToken, done) => {
            try {
                const token = await new Token().find(accessToken);
                const user = token && await new User().find(token.user);

                done(null, user !== undefined
                    ? {
                        ...user.toObject(),
                        permissions: (_
                            .chain(user.roles)
                            .map(role => role.permissions)
                        ).flatten().unique().value(),
                        roles: user.roles.map(role => role._id)
                    }
                    : false);
            } catch (error) {
                done(error);
            }
        });
    };

    async clientAuthentication (id, secret, done) {
        try {
            const client = id !== undefined && secret !== undefined
                ? await new this.Client().find(id, secret)
                : false;

            done(null, client || false);
        } catch (error) {
            done(error);
        }
    }

    clientPassword () {
        return new this.PassportOauth2ClientPassword
            .Strategy(this.clientAuthentication.bind(this));
    }

    basic () {
        return new this.PassportHttp
            .BasicStrategy(this.clientAuthentication.bind(this));
    }
};
