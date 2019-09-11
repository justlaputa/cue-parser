/**
 * TypeScript interfaces in it's own file, so it can be imported as a sub-module
 */

import {Index} from "./cuesheet";

export interface ITime {
  min: number;
  sec: number;
  frame: number;
}

export interface ITrack {
  title?: string;
  flags?: string[];
  isrc?: string;
  performer?: string;
  songWriter?: string;
  pregap?: ITime;
  postgap?: ITime;
  indexes?: Index[];
  number?: number;
}

export interface IFile {
  name?: string;
  type?: string;
  tracks?: ITrack[];
}

export interface ICueSheet {
  catalog?: string;
  cdTextFile?: string;
  files?: IFile[];
  performer?: string;
  songWriter?: string;
  title?: string;
  rem?: string[];
  encoding?: string;
}
