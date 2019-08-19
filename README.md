About
=======
cue-parser is an cue-sheet parser library written for nodejs.
Most of the code is inspired by [cue-go](https://github.com/vchimishuk/cue-go)

[![Build Status](https://travis-ci.org/justlaputa/cue-parser.png)](https://travis-ci.org/justlaputa/cue-parser)
[![NPM version](https://img.shields.io/npm/v/cue-parser.svg)](https://npmjs.org/package/cue-parser)
[![npm downloads](http://img.shields.io/npm/dm/cue-parser.svg)](https://npmcharts.com/compare/cue-parser,cuefileparser,cue-parser-plus?start=1500&interval=30)
[![Dependencies](https://david-dm.org/justlaputa/cue-parser.svg)](https://david-dm.org/justlaputa/cue-parser)\
[![Total alerts](https://img.shields.io/lgtm/alerts/g/justlaputa/cue-parser.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/justlaputa/cue-parser/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/justlaputa/cue-parser.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/justlaputa/cue-parser/context:javascript)

How to use
=======
Add cue-parser as a dependency to your project using npm:

```shell
npm install cue-parser
```

or yarn:

```shell
yarn add cue-parser
```

Use it in your node source code

```javascript
const parser = require('cue-parser');

const cuesheet = parser.parse('filename.cue');

console.log(cuesheet.performer);
console.log(cuesheet.files);
console.log(cuesheet.files[0].tracks);
```

References
==========

- [Cue sheet format kodi.wiki](http://kodi.wiki/view/Cue_sheets)
- [Cue sheet format from wiki.hydrogenaud.io](http://wiki.hydrogenaud.io/index.php?title=Cue_sheet)
