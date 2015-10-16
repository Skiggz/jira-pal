var expect = require('expect');

describe('A test', function() {

    describe('Making sure tests are running', function() {
        it('should make one assertion', function(done) {
            expect(1).toBe(1);
            // not async, but we will pretend
            done();
        });
    });
});