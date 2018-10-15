'use strict';

module.exports = async function (app, roles = 'user') {
    const { Client, Token, User } = app.dao;

    const { _id: clientId } = await new Client().findOne();
    const { _id: userId } = await new User().findOne({ query: { roles } });
    const { access } = await new Token().insert(userId, clientId);

    return `Bearer ${access}`;
};
