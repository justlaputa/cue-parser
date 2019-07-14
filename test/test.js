var path = require('path');
var expect = require('expect.js');
var parser = require('../lib/cue');

describe('cue-parser', function() {
    var sheet;

    describe('it should parse windows files with \r\n', function() {

        it('should skip newlines', function() {
            sheet = parser.parse(__dirname + '/sample-win.cue');

            expect(sheet.catalog).to.be('3898347789120');

            expect(sheet.files).to.be.an('array');
            expect(sheet.files).to.have.length(1);
            expect(sheet.files[0].name).to.be('sample file.ape');
            expect(sheet.files[0].type).to.be('WAVE');

            var tracks = sheet.files[0].tracks;

            expect(tracks).to.be.an('array');
            expect(tracks).to.have.length(2);

            expect(tracks[1].number).to.be(2);
            expect(tracks[1].type).to.be('AUDIO');
        });
    });

    describe('it should parse linux files with \n', function() {
        beforeEach(function() {
            sheet = parser.parse(__dirname + '/sample.cue');
        });

        it('should parse CATALOG', function() {
            expect(sheet.catalog).to.be('3898347789120');
        });

        it('should parse CDTEXTFILE', function() {
            expect(sheet.cdTextFile).to.be('C:\\LONG FILENAME.CDT');
        });

        it('should parse FILE', function() {
            expect(sheet.files).to.be.an('array');
            expect(sheet.files).to.have.length(1);
            expect(sheet.files[0].name).to.be('sample file.ape');
            expect(sheet.files[0].type).to.be('WAVE');
        });

        it('should parse Disk PERFORMER', function() {
            expect(sheet.performer).to.be('Sample performer');
        });

        it('should parse Disk SONGWRITER', function() {
            expect(sheet.songWriter).to.be('Sample songwriter');
        });

        it('should parse Disk TITLE', function() {
            expect(sheet.title).to.be('Sample title');
        });

        it('should parse all tracks of the file', function() {
            var tracks = sheet.files[0].tracks;

            expect(tracks).to.be.an('array');
            expect(tracks).to.have.length(3);

            expect(tracks[0].number).to.be(1);
            expect(tracks[0].type).to.be('AUDIO');

            expect(tracks[1].number).to.be(2);
            expect(tracks[1].type).to.be('AUDIO');

            expect(tracks[2].number).to.be(3);
            expect(tracks[2].type).to.be('AUDIO');
        });

        it('should parse all REMs', function() {
            expect(sheet.rem).to.be.an('array');
            expect(sheet.rem[0]).to.be('Comment in toplevel');
            expect(sheet.rem[1]).to.be('Comment in track');
        });

        describe('track detail infos', function() {
            var track1, track2;

            beforeEach(function() {
                var tracks = sheet.files[0].tracks;

                track1 = tracks[0],
                track2 = tracks[1];
                track3 = tracks[2];
            });

            it('should parse FLAGS', function() {
                expect(track1.flags).to.be.an('array');
                expect(track1.flags[0]).to.be('DCP');
                expect(track1.flags[1]).to.be('PRE');
            });

            it('should parse track ISRC', function() {
                expect(track1.isrc).to.be('ABCDE1234567');
                expect(track2.isrc).to.be(null);
            });

            it('should parse track TITLE', function () {
                expect(track1.title).to.be('Sample track 1');
                expect(track2.title).to.be('Sample track 2');
                expect(track3.title).to.be('Sample track 3');
            });

            it('should parse track PERFORMER', function() {
                expect(track1.performer).to.be('Sample performer');
                expect(track2.performer).to.be('Sample performer');
            });

            it('should parse track SONGWRITER', function() {
                expect(track1.songWriter).to.be('Sample songwriter');
                expect(track2.songWriter).to.be('Sample songwriter');
            });

            it('should parse track INDEX', function () {
                expect(track1.indexes).to.have.length(2);
                expect(track1.indexes[0].number).to.be(0);
                expect(track1.indexes[0].time).to.eql({min: 0, sec: 0, frame: 0});
                expect(track1.indexes[1].number).to.be(1);
                expect(track1.indexes[1].time).to.eql({min: 0, sec: 0, frame: 33});

                expect(track2.indexes).to.have.length(2);
                expect(track2.indexes[0].number).to.be(0);
                expect(track2.indexes[0].time).to.eql({min: 0, sec: 5, frame: 10});
                expect(track2.indexes[1].number).to.be(1);
                expect(track2.indexes[1].time).to.eql({min: 0, sec: 5, frame: 23});

                expect(track3.indexes).to.have.length(2);
                expect(track3.indexes[0].number).to.be(0);
                expect(track3.indexes[0].time).to.eql({min: 9999, sec: 5, frame: 10});
                expect(track3.indexes[1].number).to.be(1);
                expect(track3.indexes[1].time).to.eql({min: 9999, sec: 5, frame: 23});
            });

            it('should parse track PREGAP', function() {
                expect(track1.pregap).to.eql({min: 0, sec: 2, frame: 0});
                expect(track2.pregap).to.be(null);
            });

            it('should parse track POSTGAP', function() {
                expect(track1.postgap).to.eql({min: 0, sec: 2, frame: 0});
                expect(track2.postgap).to.be(null);
            });
        });
    });

    describe('it should parse EAC generated CUE files', function() {

        it('parse: Frank Boeijen - Palermo - CD1.eac.cue', () => {
            sheet = parser.parse(path.join(__dirname, 'Frank Boeijen - Palermo - CD1.eac.cue'));
            expect(sheet.performer).to.be('Frank Boeijen');
            expect(sheet.title).to.be('Palermo');
            expect(sheet.files.length).to.be(10);
        });

        it('parse: Frank Boeijen Groep - Welkom In Utopia', () => {
            sheet = parser.parse(path.join(__dirname, 'Frank Boeijen Groep - Welkom In Utopia.eac.cue'));
            expect(sheet.performer).to.be('Frank Boeijen Groep');
            expect(sheet.title).to.be('Welkom In Utopia');
            expect(sheet.files.length).to.be(11);
        });
    });

    describe('it should parse XLD generated CUE files', function() {

        it('parse: Putumayo Presents - Yoga Lounge', () => {
            sheet = parser.parse(path.join(__dirname, 'Putumayo Presents - Yoga Lounge.xld.cue'));
            expect(sheet.files.length).to.be(12);

            const file_track_1 = sheet.files[0];
            expect(file_track_1.tracks.length).to.be(1);
            expect(file_track_1.tracks[0].title).to.be('Dreamcatcher');
            expect(file_track_1.tracks[0].performer).to.be('Bahramji & Maneesh De Moor');
        });
    });

});
