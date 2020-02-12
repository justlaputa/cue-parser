/**
 * Main library
 */
import * as fs from 'fs';
import * as chardet from 'chardet';
import { parseCommand } from './command';
import { CueSheet, Index, Time } from './cuesheet';
import { ICueSheet, ITime } from "./types";

type parserFunction = (params: string[], cuesheet: CueSheet) => void;

const commandMap: { [command: string]: parserFunction; } = {
  CATALOG: parseCatalog,
  CDTEXTFILE: parseCdTextFile,
  FILE: parseFile,
  FLAGS: parseFlags,
  INDEX: parseIndex,
  ISRC: parseIsrc,
  PERFORMER: parsePerformer,
  POSTGAP: parsePostgap,
  PREGAP: parsePregap,
  REM: parseRem,
  SONGWRITER: parseSongWriter,
  TITLE: parseTitle,
  TRACK: parseTrack
};

/**
 * Parse function
 * @param filename Filename path to cue-sheet to be parsed
 * @return CUE-sheet information object
 */
export function parse(filename: string): ICueSheet {
  const cuesheet = new CueSheet();

  if (!filename) {
    console.log('no file name specified for parse');
    return;
  }

  if (!fs.existsSync(filename)) {
    throw new Error('file ' + filename + ' does not exist');
  }

  cuesheet.encoding = chardet.detect(fs.readFileSync(filename));
  let encoding = cuesheet.encoding;

  if (cuesheet.encoding.startsWith('ISO-8859-')) {
    encoding = 'binary';
  }

  const lines = (fs.readFileSync(filename, {encoding, flag: 'r'}) as any)
    .replace(/\r\n/, '\n').split('\n');

  lines.forEach(line => {
    if (!line.match(/^\s*$/)) {
      const lineParser = parseCommand(line);
      commandMap[lineParser.command](lineParser.params, cuesheet);
    }
  });

  if (!cuesheet.files[cuesheet.files.length - 1].name) {
    cuesheet.files.pop();
  }

  return cuesheet;
}

function parseCatalog(params: string[], cuesheet: CueSheet) {
  cuesheet.catalog = params[0];
}

function parseCdTextFile(params, cuesheet) {
  cuesheet.cdTextFile = params[0];
}

function parseFile(params: string[], cuesheet: CueSheet) {
  let file = cuesheet.getCurrentFile();

  if (!file || file.name) {
    file = cuesheet.newFile();
  }

  file.name = params[0];
  file.type = params[1];
}

function parseFlags(params: string[], cueSheet: CueSheet) {
  const track = cueSheet.getCurrentTrack();

  if (!track) {
    throw new Error('No track for adding flag: ' + params);
  }

  track.flags = params.slice(0);
}

function parseIndex(params: string[], cueSheet: CueSheet): Index {
  const _number = parseInt(params[0], 10);
  const time = parseTime(params[1]);
  const track = cueSheet.getCurrentTrack();

  if (!track) {
    throw new Error('No track found for index ' + params);
  }

  if (track.postgap) {
    throw new Error('POSTGAP should be after all indexes');
  }

  if (_number < 0 || _number > 99) {
    throw new Error(`Index number must between 0 and 99: ${_number}`);
  }

  if (_number === 1 && time.min === 0 && time.min === 0 && time.sec === 0 && time.frame === 0) {
    cueSheet.newFile();
    return;
  }

  if (!track.indexes) {
    if (_number > 2) {
      throw new Error(`Invalid index number ${_number}, First index number must be 0 or 1`);
    }
    track.indexes = [];
  } else {
    if (_number !== track.indexes[track.indexes.length - 1].number + 1) {
      throw new Error(`Invalid index number: ${_number}, it should follow the last sequence`);
    }
  }

  track.indexes.push(new Index(_number, time));
}

function parseIsrc(params, cueSheet: CueSheet) {
  const track = cueSheet.getCurrentTrack();

  if (!track) {
    throw new Error('No track for adding isrc: ' + params);
  }

  track.isrc = params[0];
}

function parsePerformer(params, cueSheet: CueSheet) {
  const track = cueSheet.getCurrentTrack();

  if (!track) {
    cueSheet.performer = params[0];
  } else {
    track.performer = params[0];
  }
}

function parsePostgap(params, cueSheet: CueSheet) {
  const track = cueSheet.getCurrentTrack();

  if (!track) {
    throw new Error('POSTGAP can only used in TRACK');
  }

  if (track.postgap) {
    throw new Error('only one POSTGAP is allowed for a track');
  }

  track.postgap = parseTime(params[0]);
}

function parsePregap(params, cueSheet: CueSheet) {
  const track = cueSheet.getCurrentTrack();

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

function parseRem(params, cueSheet: CueSheet) {
  if (!cueSheet.rem) {
    cueSheet.rem = [];
  }

  cueSheet.rem.push(params.join(' '));
}

function parseSongWriter(params, cueSheet: CueSheet) {
  const track = cueSheet.getCurrentTrack();

  if (!track) {
    cueSheet.songWriter = params[0];
  } else {
    track.songWriter = params[0];
  }
}

function parseTitle(params, cueSheet: CueSheet) {
  const track = cueSheet.getCurrentTrack();

  if (!track) {
    cueSheet.title = params[0];
  } else {
    track.title = params[0];
  }
}

function parseTrack(params, cuesheet: CueSheet) {
  const _number = parseInt(params[0], 10);
  cuesheet.newTrack(_number, params[1]);
}

function parseTime(timeSting): ITime {
  const timePattern = /^(\d{2,}):(\d{2}):(\d{2})$/;
  const parts = timeSting.match(timePattern);

  if (!parts) {
    throw new Error(`Invalid time format: ${timeSting}`);
  }

  const time = new Time();
  time.min = parseInt(parts[1], 10);
  time.sec = parseInt(parts[2], 10);
  time.frame = parseInt(parts[3], 10);

  if (time.sec > 59) {
    throw new Error(`Time second should be less than 60: ${timeSting}`);
  }

  if (time.frame > 74) {
    throw new Error(`Time frame should be less than 75: ${timeSting}`);
  }

  return time;
}
