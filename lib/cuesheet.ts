import { ITime, ICueSheet, IFile, ITrack } from "./types";

export class Track implements ITrack {

  public title: string = null;
  public flags: string[] = null;
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

export class File implements IFile {

  public name: string = null;
  public type: string = null;
  public tracks: Track[] = null;
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

export class CueSheet implements ICueSheet {

  public catalog: string = null;
  public cdTextFile: string = null;
  public files: File[] = null;
  public performer: string = null;
  public songWriter: string = null;
  public title: string = null;
  public rem: string[] = null;
  public encoding: string;

  private track: Track;

  public getCurrentFile(): File {
    if (this.files && this.files.length > 0) {
      return this.files[this.files.length - 1];
    } else {
      return null;
    }
  }

  public getCurrentTrack(): Track {
    return this.track;
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

    this.track = new Track(_number, type);
    return this;
  }
}
