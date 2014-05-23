/**
 * Main library
 */
 var fs = require('fs')
 , parseCommand = require('./command')
 , CueSheet = require('./cuesheet').CueSheet
 , File = require('./cuesheet').File
 , Index = require('./cuesheet').Index
 , Time = require('./cuesheet').Time;


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
    lines[0] = lines[0].replace(/^\uFEFF/, '');

    lines.forEach(function(line) {

        lineParser = parseCommand(line);

        commandMap[lineParser.command](lineParser.params, cuesheet);
    });

    return cuesheet;
}

function parseCatalog(params, cuesheet) {
    cuesheet.catalog = params[0];
}

function parseCdTextFile(params, cuesheet) {
    cuesheet.cdTextFile = params[0];
}

function parseFile(params, cuesheet) {
    var file;
    
    file = cuesheet.newFile().getCurrentFile();

    file.name = params[0];
    file.type = params[1];
}

function parseFlags(params, cuesheet) {
    var track = cuesheet.getCurrentTrack();

    if (!track) {
        throw new Error('No track for adding flag: ' + params);
    }

    track.flags = params.slice(0);
}

function parseIndex(params, cuesheet) {
    var number = parseInt(params[0], 10)
    , time = parseTime(params[1])
    , track = cuesheet.getCurrentTrack();

    if (!track) {
        throw new Error('No track found for index ' + params);
    }

    if (track.postgap) {
        throw new Error('POSTGAP should be after all indexes');
    }

    if (number < 0 || number > 99) {
        throw new Error('Index nubmer must between 0 and 99: ', number);
    }

    if (!track.indexes) {
        if (number > 2) {
            throw new Error('Invalid index number ' + number + ', First index number must be 0 or 1');
        }
        track.indexes = [];
    } else {
        if (number !== track.indexes[track.indexes.length - 1].number + 1) {
            throw new Error('Invalid index number: ' + number + ', it should follow the last sequence');
        }
    }

    track.indexes.push(new Index(number, time));
}

function parseIsrc(params, cuesheet) {
    var track = cuesheet.getCurrentTrack();

    if (!track) {
        throw new Error('No track for adding isrc: ' + params);
    }

    track.isrc = params[0];
}

function parsePerformer(params, cuesheet) {
    var track = cuesheet.getCurrentTrack();

    if (!track) {
        cuesheet.performer = params[0];
    } else {
        track.performer = params[0];
    }
}

function parsePostgap(params, cuesheet) {
    var track = cuesheet.getCurrentTrack();

    if (!track) {
        throw new Error('POSTGAP can only used in TRACK');
    }

    if (track.postgap) {
        throw new Error('only one POSTGAP is allowed for a track');
    }

    track.postgap = parseTime(params[0]);
}

function parsePregap(params, cuesheet) {
    var track = cuesheet.getCurrentTrack();

    if (!track) {
        throw new Error('PREGAP can only used in TRACK');
    }

    if (track.pregap) {
        throw new Error('only one PREGAP is allowed for a track');
    }

    if (track.indexes && track.indexes.length > 0) {
        throw new Error('PREGAP should be before any INDEX');
    }

    track.pregap = parseTime(params[0]);
}

function parseRem(params, cuesheet) {
    if (!cuesheet.rem) {
        cuesheet.rem = [];
    }

    cuesheet.rem.push(params.join(' '));
}

function parseSongWriter(params, cuesheet) {
    var track = cuesheet.getCurrentTrack();

    if (!track) {
        cuesheet.songWriter = params[0];
    } else {
        track.songWriter = params[0];
    }
}

function parseTitle(params, cuesheet) {
    var track = cuesheet.getCurrentTrack();

    if (!track) {
        cuesheet.title = params[0];
    } else {
        track.title = params[0];
    }
}

function parseTrack(params, cuesheet) {
    var number = parseInt(params[0], 10);
    cuesheet.newTrack(number, params[1]);
}

function parseTime(timeSting) {
    var timePattern = /^(\d{2}):(\d{2}):(\d{2})$/,
    parts = timeSting.match(timePattern),
    time = new Time();

    if (!parts) {
        throw new Error('Invalid time format:' + timeSting);
    }

    time.min = parseInt(parts[1], 10);
    time.sec = parseInt(parts[2], 10);
    time.frame = parseInt(parts[3], 10);

    if (time.sec > 59) {
        throw new Error('Time second should be less than 60: ' + timeSting);
    }

    if (time.frame > 74) {
        throw new Error('Time frame should be less than 75: ' + timeSting);
    }

    return time;
}
