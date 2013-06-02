var expect = require('expect.js')
  , parser = require('../lib/cue');

describe('cue-parser', function() {
    it('should pass', function() {
        parser.parse(__dirname + '/sample.cue');
        expect(1).to.be(1);
    });
});