'use strict';

module.exports = function (app) {
    const user = new app.controllers.User();

    return [
        {
            method: 'get',
            url: '/users',
            action: user.list.bind(user),
            cors: true,
            corsExtraHeaders: 'X-Count',
            checkPermissions: true,
            permissions: [ 'user:list', 'user:listMe' ]
        },
        {
            method: 'get',
            url: '/users/:id',
            action: user.find.bind(user),
            cors: true,
            checkPermissions: true,
            permissions: [ 'user:read', 'user:readMe' ]
        },
        {
            method: 'post',
            url: '/users',
            action: user.insert.bind(user),
            cors: true,
            authentication: { strategy: 'basic' }
        },
        {
            method: 'put',
            url: '/users/:id',
            action: user.modify.bind(user),
            cors: true,
            checkPermissions: true,
            permissions: [ 'user:modify', 'user:modifyMe' ],
            files: true,
            logger: true
        },
        {
            method: 'delete',
            url: '/users/:id',
            action: user.delete.bind(user),
            cors: true,
            checkPermissions: true,
            permissions: [ 'user:delete', 'user:deleteMe' ]
        }
    ];
};
