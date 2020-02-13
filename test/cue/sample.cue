CATALOG 3898347789120
CDTEXTFILE "C:\LONG FILENAME.CDT"
PERFORMER "Sample performer"
SONGWRITER "Sample songwriter"
TITLE "Sample title"
REM Comment in toplevel

FILE "sample file.ape" WAVE
  TRACK 01 AUDIO
    FLAGS DCP PRE
    ISRC ABCDE1234567
    TITLE "Sample track 1"
    PERFORMER "Sample performer"
    SONGWRITER "Sample songwriter"
    PREGAP 00:02:00
    INDEX 00 00:00:00
    INDEX 01 00:00:33
    POSTGAP 00:02:00

  TRACK 02 AUDIO
    TITLE "Sample track 2"
    PERFORMER "Sample performer"
    SONGWRITER "Sample songwriter"
    INDEX 00 00:05:10
    INDEX 01 00:05:23
    REM Comment in track

  TRACK 03 AUDIO
    TITLE "Sample track 3"
    PERFORMER "Sample performer"
    SONGWRITER "Sample songwriter"
    INDEX 00 9999:05:10
    INDEX 01 9999:05:23
    REM Comment in track
