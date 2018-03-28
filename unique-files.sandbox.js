const fs = require('fs')
const Bacon = require('baconjs')
const uniqueFilesInDirectory = require('./unique-files.js')(Bacon)

uniqueFilesInDirectory('.\\')
    .onValue(x => console.log(x))