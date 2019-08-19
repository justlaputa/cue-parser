export function File() {
  this.name = null;
  this.type = null;
  this.tracks = null;
}

export class Track {

  title = null;
  flags = null;
  isrc = null;
  performer = null;
  songWriter = null;
  pregap = null;
  postgap = null;
  indexes = null;

  constructor(public number: number, public type = null) {
  }
}

export class Index {

  constructor(public number: number = null, public time = null) {
  }
}

export class Time {

  constructor(public min: number = 0, public sec = 0, public frame = 0) {
  }
}

export class CueSheet {

  catalog = null;
  cdTextFile = null;
  files = null;
  performer = null;
  songWriter = null;
  title = null;
  rem = null;
  encoding: string;

  getCurrentFile() {
    if (this.files && this.files.length > 0) {
      return this.files[this.files.length - 1];
    } else {
      return null;
    }
  }

  getCurrentTrack() {
    const file = this.getCurrentFile();

    if (file && file.tracks && file.tracks.length > 0) {
      return file.tracks[file.tracks.length - 1];
    } else {
      return null;
    }
  }

  newFile() {
    if (!this.files) {
      this.files = [];
    }

    const file = new File();
    this.files.push(file);

    return file;
  }

  newTrack(number, type) {
    const file = this.getCurrentFile();

    if (!file) {
      throw new Error('No file for track: ' + number + type);
    }

    if (!file.tracks) {
      file.tracks = [];
    }

    file.tracks.push(new Track(number, type));

    return this;
  }
}