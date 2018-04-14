const frisby = require('frisby');
const Joi = frisby.Joi; // Frisby exports Joi for convenience on type assersions

// use localhost unless env var is specified
// To run on CircleCI, you will need to add an API_BASE_URL env var via their interface
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('GET /test', () => {
    it ('returns 200 with the correct properties', function (done) {
        frisby.get(`${BASE_URL}/test`)
            .expect('status', 200)
            .expect('jsonTypes', 'event.stageVariables.lambdaAliasName', 'DEV')
            .expect('jsonTypes', 'version', 'V Another branch')
            .done(done)
            .catch(done);
    });
});