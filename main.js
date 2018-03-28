const fs = require('fs')
const Bacon = require('baconjs')
const uniqueFiles = require('./unique-files')(Bacon)
const sorter = require('./sorter')

const config = JSON.parse(fs.readFileSync('./config.json'))

function platformDefinedData(platform) {
    return {
        win32: {
            separator: '\\',
            downloadsPath: process.env.HOMEDRIVE + process.env.HOMEPATH + '\\' + config.root
        },
        linux: {
            separator: '/',
            downloadsPath: process.env.HOME + '/' + config.root
        }
    }[platform]
}

const platformDepended = platformDefinedData(process.platform)

// sorts files into directories
sorter(platformDepended, config.directories)

// unlinking old copies
Bacon.fromArray(config.directories)
    .map(field => field.name)
    .map(category => platformDepended.downloadsPath + platformDepended.separator + category + platformDepended.separator)
    .filter(path => fs.existsSync(path))
    .flatMap(uniqueFiles)
    .filter(path => fs.existsSync(path))
    .onValue(path => fs.unlinkSync(path))
