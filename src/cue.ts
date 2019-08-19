/**
 * Main library
 */
import * as fs from 'fs';
import { parseCommand } from './command';
import { CueSheet } from './cuesheet';
import { File } from './cuesheet';
import { Index, Time } from './cuesheet';
import * as chardet from 'chardet';

const commandMap = {
  'CATALOG': parseCatalog,
  'CDTEXTFILE': parseCdTextFile,
  'FILE': parseFile,
  'FLAGS': parseFlags,
  'INDEX': parseIndex,
  'ISRC': parseIsrc,
  'PERFORMER': parsePerformer,
  'POSTGAP': parsePostgap,
  'PREGAP': parsePregap,
  'REM': parseRem,
  'SONGWRITER': parseSongWriter,
  'TITLE': parseTitle,
  'TRACK': parseTrack
};


/**
 * parse function
 */

export function parse(filename) {
  var lineParser;
  var lines;

  const cuesheet = new CueSheet()

  if (!filename) {
    console.log('no file name specified for parse');
    return;
  }

  if (!fs.existsSync(filename)) {
    throw new Error('file ' + filename + ' does not exist');
  }

  cuesheet.encoding = chardet.detect(fs.readFileSync(filename));
  let encoding = cuesheet.encoding;

  switch (cuesheet.encoding) {
    case 'ISO-8859-1':
      encoding = 'binary';
      break;
  }

  lines = ( fs.readFileSync(filename, {encoding: encoding, flag: 'r'}) as any)
    .replace(/\r\n/, '\n').split('\n');

  lines.forEach(function(line) {
    if (!line.match(/^\s*$/)) {
      lineParser = parseCommand(line);
      commandMap[lineParser.command](lineParser.params, cuesheet);
    }
  });

  if (!cuesheet.files[cuesheet.files.length - 1].name) {
    cuesheet.files.pop();
  }

  return cuesheet;
}

export function parseCatalog(params, cuesheet) {
  cuesheet.catalog = params[0];
}

export function parseCdTextFile(params, cuesheet) {
  cuesheet.cdTextFile = params[0];
}

export function parseFile(params, cuesheet) {
  var file = cuesheet.getCurrentFile();

  if (!file || file.name) {
    file = cuesheet.newFile();
  }

  file.name = params[0];
  file.type = params[1];
}

export function parseFlags(params, cuesheet) {
  var track = cuesheet.getCurrentTrack();

  if (!track) {
    throw new Error('No track for adding flag: ' + params);
  }

  track.flags = params.slice(0);
}

export function parseIndex(params, cuesheet) {
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
    throw new Error(`Index number must between 0 and 99: ${number}`);
  }

  if (number === 1 && time.min === 0 && time.min === 0 && time.sec === 0 && time.frame === 0) {
    cuesheet.newFile();
    return;
  }

  if (!track.indexes) {
    if (number > 2) {
      throw new Error(`Invalid index number ${number}, First index number must be 0 or 1`);
    }
    track.indexes = [];
  } else {
    if (number !== track.indexes[track.indexes.length - 1].number + 1) {
      throw new Error(`Invalid index number: ${number}, it should follow the last sequence`);
    }
  }

  track.indexes.push(new Index(number, time));
}

function parseIsrc(params, cuesheet) {
  const track = cuesheet.getCurrentTrack();

  if (!track) {
    throw new Error('No track for adding isrc: ' + params);
  }

  track.isrc = params[0];
}

function parsePerformer(params, cuesheet) {
  const track = cuesheet.getCurrentTrack();

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
  const track = cuesheet.getCurrentTrack();

  if (!track) {
    cuesheet.title = params[0];
  } else {
    track.title = params[0];
  }
}

function parseTrack(params, cuesheet) {
  const number = parseInt(params[0], 10);
  cuesheet.newTrack(number, params[1]);
}

function parseTime(timeSting) {
  const timePattern = /^(\d{2,}):(\d{2}):(\d{2})$/,
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