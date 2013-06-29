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

    it('should parse CDTEXTFILE', function() {
        expect(sheet.cdTextFile).to.be(null);
    });

    it('should parse FILE', function() {
        expect(sheet.files).to.be.an('array');
        expect(sheet.files).to.have.length(1);
        expect(sheet.files[0].name).to.be('sample file.ape');
        expect(sheet.files[0].type).to.be('WAVE');
    });

    it('should parse all tracks of the file', function() {
        var tracks = sheet.files[0].tracks;


        expect(tracks).to.be.an('array');
        expect(tracks).to.have.length(2);

        expect(track[0].number).to.be(1);
        expect(track[0].type).to.be('AUDIO');

        expect(track[1].number).to.be(2);
        expect(track[1].type).to.be('AUDIO');
    });

    it('should parse track detail info', function() {
        var tracks = sheet.files[0].tracks,
        track1 = track[0],
        track2 = track[1];

        expect(track1.title).to.be('Sample track 1');
        expect(track1.performer).to.be('Sample performer');
        expect(track1.indexes).to.have.length(2);
        expect(track1.indexes[0]).to.be('00:00:00');
        expect(track1.indexes[1]).to.be('00:00:33');

        expect(track2.title).to.be('Sample track 2');
        expect(track2.performer).to.be('Sample performer');
        expect(track2.indexes).to.have.length(2);
        expect(track2.indexes[0]).to.be('00:05:10');
        expect(track2.indexes[1]).to.be('00:05:23');        
    });
});