const {expect} = require('chai');
const {handler} = require('../../index');

describe('handler()', function() {
    it('should return a promise with the correct values', function() {
        const mockEvent = {testEvent: true};
        return handler(mockEvent)
            .then(resp => {
                expect(resp).to.deep.equal({
                    statusCode: 200,
                    body: JSON.stringify({event: mockEvent, version: 'V Another branch'})
                });
            });
    });
});
