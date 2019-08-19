export function CueSheet() {
    this.catalog = null;
    this.cdTextFile = null;
    this.files = null;
    this.performer = null;
    this.songWriter = null;
    this.title = null;
    this.rem = null;
}

export function File() {
    this.name = null;
    this.type = null;
    this.tracks = null;
}

export function Track(number, type) {
    this.number = (number === undefined ? null : number);
    this.type = (type || null);
    this.title = null;
    this.flags = null;
    this.isrc = null;
    this.performer = null;
    this.songWriter = null;
    this.pregap = null;
    this.postgap = null;
    this.indexes = null;
}

export function Index(number, time) {
    this.number = (number === undefined ? null : number);
    this.time = (time || null);
}

export function Time(min: number = 0, sec = 0, frame = 0) {
    this.min = min;
    this.sec = sec;
    this.frame = frame;
}

CueSheet.prototype.getCurrentFile = function() {
    if (this.files && this.files.length > 0) {
        return this.files[this.files.length - 1];
    } else {
        return null;
    }
};

CueSheet.prototype.getCurrentTrack = function() {
    var file = this.getCurrentFile();

    if (file && file.tracks && file.tracks.length > 0) {
        return file.tracks[file.tracks.length - 1];
    } else {
        return null;
    }
};

CueSheet.prototype.newFile = function() {
    if (!this.files) {
        this.files = [];
    }

    var file = new File();
    this.files.push(file);

    return file;
};

CueSheet.prototype.newTrack = function(number, type) {
    var file = this.getCurrentFile();

    if (!file) {
        throw new Error('No file for track: ' + number + type);
    }

    if (!file.tracks) {
        file.tracks = [];
    }

    file.tracks.push(new Track(number, type));

    return this;
};