const express = require('express');
const app = express();
const apiGatewayEvent = require('./events/api-gateway.json');
const {handler} = require('../index');

app.get('/test', (req, res) => {
    
    return handler(apiGatewayEvent)
        .then((resp) => {res.send(JSON.parse(resp.body));})
        .catch(err => {res.send(err);});
});

app.listen(3000, () => console.info('Example app listening on port 3000!'));