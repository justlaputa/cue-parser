var expect = require('expect.js')
  , parser = require('../lib/cue');

describe('cue-parser', function() {
    var sheet;

    beforeEach(function() {
        sheet = parser.parse(__dirname + '/sample.cue');
    });

    it('should parse CATALOG', function() {
        expect(sheet.catalog).to.be('3898347789120');
    });
});