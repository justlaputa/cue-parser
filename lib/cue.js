/**
 * Main library
 */
var fs = require('fs')
  , lineReader = require('line-reader')
  , CueSheet = require('./cuesheet');


var commandMap = {
    'CATALOG':    parseCatalog,
    'CDTEXTFILE': parseCdTextFile,
    'FILE':       parseFile,
    'FLAGS':      parseFlags,
    'INDEX':      parseIndex,
    'ISRC':       parseIsrc,
    'PERFORMER':  parsePerformer,
    'POSTGAP':    parsePostgap,
    'PREGAP':     parsePregap,
    'REM':        parseRem,
    'SONGWRITER': parseSongWriter,
    'TITLE':      parseTitle,
    'TRACK':      parseTrack
}

exports = module.exports;

/**
 * parse function
 */

exports.parse = function(filename) {
    if (!filename) {
        console.log('no file name specified for parse');
        return;
    }

    if (!fs.existsSync(filename)) {
        throw new Error('file ' + filename + ' does not exist');
    }

    lineReader.eachLine(filename, function(line, last) {
        console.log('CUE line: ', line);

        if (last) {
            return false;
        }
    });
}

function parseCatalog() {

}

function parseCdTextFile() {

}

function parseFile() {

}

function parseFlags() {

}

function parseIndex() {

}

function parseIsrc() {

}

function parsePerformer() {

}

function parsePostgap() {

}

function parsePregap() {

}

function parseRem() {

}

function parseSongWriter() {

}

function parseTitle() {

}

function parseTrack() {

}

if (require.main === module) {
    exports.parse('test/sample.cue');
}
