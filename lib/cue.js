/**
 * Main library
 */
 var fs = require('fs')
 , parseCommand = require('./command')
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
    var lineParser
    , cuesheet = new CueSheet()
    , lines;

    if (!filename) {
        console.log('no file name specified for parse');
        return;
    }

    if (!fs.existsSync(filename)) {
        throw new Error('file ' + filename + ' does not exist');
    }

    lines = fs.readFileSync(filename, {encoding: 'utf8', flag: 'r'}).toString().split('\n');

    lines.forEach(function(line) {

        lineParser = parseCommand(line);

        commandMap[lineParser.command](lineParser.params, cuesheet);
    });

    return cuesheet;
}

function parseCatalog(params, cuesheet) {
    console.log('catalog: ', params);
    cuesheet.catalog = params[0];
}

function parseCdTextFile(params, cuesheet) {
    console.log('cdtextfile');
    cuesheet.cdTextFile = params[0];
}

function parseFile(params, cuesheet) {
    var file;

    console.log('file: ', params);
    
    file = cuesheet.newFile().getCurrentFile();

    file.name = params[0];
    file.type = params[1];
}

function parseFlags() {
    console.log('flags');
}

function parseIndex() {
    console.log('index');
}

function parseIsrc() {
    console.log('isrc');
}

function parsePerformer() {
    console.log('performer');
}

function parsePostgap() {
    console.log('postgap');
}

function parsePregap() {
    console.log('pregap');
}

function parseRem() {
    console.log('rem');
}

function parseSongWriter() {
    console.log('songwriter');
}

function parseTitle() {
    console.log('title');
}

function parseTrack() {
    console.log('track');
}

if (require.main === module) {
    exports.parse('test/sample.cue');
}
