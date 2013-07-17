
module.exports.CueSheet = CueSheet;
module.exports.File = File;
module.exports.Track = Track;
module.exports.Index = Index;
module.exports.Time = Time;

function CueSheet() {
    this.catalog = null;
    this.cdTextFile = null;
    this.files = null;
    this.performer = null;
    this.songWriter = null;
    this.title = null;
    this.rems = null;
}

function File() {
    this.name = null;
    this.type = null;
    this.tracks = null;
}

function Track(number, type) {
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

function Index(number, time) {
    this.number = (number === undefined ? null : number);
    this.time = (time || null);
}

function Time(min, sec, frame) {
    this.min = min || 0;
    this.sec = sec || 0;
    this.frame = frame || 0;
}

CueSheet.prototype.getCurrentFile = function() {
    if (this.files && this.files.length > 0) {
        return this.files[this.files.length - 1];
    } else {
        return null;
    }
}

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

    this.files.push(new File());

    return this;
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