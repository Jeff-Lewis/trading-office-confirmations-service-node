var expect = require('chai').expect,
    restify = require('restify'),
    assert = require('assert');

var client = restify.createJSONClient({
    url: 'http://127.0.0.1:8080'
});



describe('Confirmations Service', function () {
    before(function (done) {
        require('../server').StartServer();
        done();
    });

    describe('saves confirmation', function () {
        it('returns same confirmation when queried', function(done) {
            var confirmation = {
                allocationId: "12345",
                customField: "ABC"
            };

            client.post('/api/confirmation', confirmation, function (err, req, res, obj) {
                assert.ifError(err);
                console.log('Server returned: %j', obj);

                client.get('/api/confirmation/12345', function (err, req, res, obj) {
                    assert.ifError(err);

                    expect(obj.customField).to.equal("ABC");
                    done();
                });
            });
        });
    });
});