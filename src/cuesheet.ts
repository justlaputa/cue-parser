import { ITime } from './cue';

export class File {

  name:string = null;
  type: string = null;
  tracks: Track[] = null;
}

export class Track {

  title: string = null;
  flags: string = null;
  isrc: string = null;
  performer: string = null;
  songWriter: string = null;
  pregap: ITime = null;
  postgap: ITime = null;
  indexes: Index[] = null;

  constructor(public number: number, public type = null) {
  }
}

export class Index {

  constructor(public number: number = null, public time: Time = null) {
  }
}

export class Time {

  constructor(public min: number = 0, public sec = 0, public frame = 0) {
  }
}

export class CueSheet {

  catalog: string = null;
  cdTextFile: string = null;
  files: File[] = null;
  performer: string = null;
  songWriter: string = null;
  title: string = null;
  rem: string[] = null;
  encoding: string;

  getCurrentFile(): File {
    if (this.files && this.files.length > 0) {
      return this.files[this.files.length - 1];
    } else {
      return null;
    }
  }

  getCurrentTrack(): Track {
    const file = this.getCurrentFile();

    if (file && file.tracks && file.tracks.length > 0) {
      return file.tracks[file.tracks.length - 1];
    } else {
      return null;
    }
  }

  newFile(): File {
    if (!this.files) {
      this.files = [];
    }

    const file = new File();
    this.files.push(file);

    return file;
  }

  newTrack(number: number, type: string): CueSheet {
    const file = this.getCurrentFile();

    if (!file) {
      throw new Error(`No file for track: ${number} ${type}`);
    }

    if (!file.tracks) {
      file.tracks = [];
    }

    file.tracks.push(new Track(number, type));

    return this;
  }
}