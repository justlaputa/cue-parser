import { ITime } from './cue';

export class File {

  public name: string = null;
  public type: string = null;
  public tracks: Track[] = null;
}

export class Track {

  public title: string = null;
  public flags: string = null;
  public isrc: string = null;
  public performer: string = null;
  public songWriter: string = null;
  public pregap: ITime = null;
  public postgap: ITime = null;
  public indexes: Index[] = null;
  public number: number;

  constructor(_number: number, public type: string = null) {
    this.number = _number;
  }
}

export class Index {

  public number: number;

  constructor(_number: number = null, public time: Time = null) {
    this.number = _number;
  }
}

export class Time {

  constructor(public min: number = 0, public sec = 0, public frame = 0) {
  }
}

export class CueSheet {

  public catalog: string = null;
  public cdTextFile: string = null;
  public files: File[] = null;
  public performer: string = null;
  public songWriter: string = null;
  public title: string = null;
  public rem: string[] = null;
  public encoding: string;

  public getCurrentFile(): File {
    if (this.files && this.files.length > 0) {
      return this.files[this.files.length - 1];
    } else {
      return null;
    }
  }

  public getCurrentTrack(): Track {
    const file = this.getCurrentFile();

    if (file && file.tracks && file.tracks.length > 0) {
      return file.tracks[file.tracks.length - 1];
    } else {
      return null;
    }
  }

  public newFile(): File {
    if (!this.files) {
      this.files = [];
    }

    const file = new File();
    this.files.push(file);

    return file;
  }

  public newTrack(_number: number, type: string): CueSheet {
    const file = this.getCurrentFile();

    if (!file) {
      throw new Error(`No file for track: ${_number} ${type}`);
    }

    if (!file.tracks) {
      file.tracks = [];
    }

    file.tracks.push(new Track(_number, type));

    return this;
  }
}
