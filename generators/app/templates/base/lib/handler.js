const handler = (event, context) => {
    const resp = {
        event,
        version: 'V Another branch'
    };

    // using node v8.10 allows us to return promises instead of using callbacks
    return Promise.resolve({
        statusCode: 200,
        body: JSON.stringify(resp)
    });
};

module.exports = handler;
