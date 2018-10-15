'use strict';

const sequence = functions => functions
    .reduce((promise, thenable) => promise.then(thenable), Promise.resolve());

module.exports = async function (app, exclude) {
    const { Mongoose } = app.utilities;

    const [ connection ] = Mongoose.connections
        .filter(conn => conn._readyState === 1);

    await sequence(connection.modelNames()
        .map(modelName => connection.models[modelName])
        .filter(model => model !== undefined && model.collection !== undefined)
        .map(model => new Promise((resolve, reject) =>
            model.collection.deleteMany({}, resolve))
        )
    );

    return app;
};
