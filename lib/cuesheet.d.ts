export class CueSheet {
    catalog: string | null;
    cdTextFile: string | null;
    files: File[] | null;
    performer: string | null;
    songWriter: string | null;
    title: string | null;
    rem: string[] | null;

    getCurrentFile(): File | null;
    getCurrentTrack(): Track | null;
    newFile(): this;
    newTrack(number: number, type: string): this;
}

export class File {
    name: string;
    type: string;
    tracks: Track[] | null;
}

export class Track {
    constructor(number: number, type: string);
    number: number;
    type: string;
    title: string | null;
    flags: string[] | null;
    isrc: string | null;
    performer: string | null;
    songWriter: string | null;
    pregap: Time | null;
    postgap: Time | null;
    indexes: Index[] | null;
}

export class Index {
    constructor(number: number, time: Time);
    number: number;
    time: Time;
}

export class Time {
    constructor(min?: number, sec?: number, frame?: number);
    min: number;
    sec: number;
    frame: number;
}