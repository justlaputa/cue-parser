
module.exports = CueSheet;

function CueSheet() {
    this.catalog = null;
    this.cdTextFile = null;
    this.files = null;
    this.flags = null;
    this.isrc = null;
    this.performer = null;
    this.songWriter = null;
    this.title = null;
    this.rems = null;
}

function Track() {
    this.number = null;
    this.type = null;
    this.title = null;
    this.performer = null;
    this.songWriter = null;
    this.pregap = null;
    this.postgap = null;
    this.indexs = null;
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
}

CueSheet.prototype.newTrack = function() {
    var file = this.getCurrentFile(),
    track;

    if (file) {
        if (!file.tracks) {
            file.tracks = [];
        }
        track = new Track();
        file.tracks.push(track);

        return track;
    } else {
        return null;
    }
}