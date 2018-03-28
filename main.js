const fs = require('fs')
const sorter = require('./sorter.js')

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
sorter(platformDepended, config.directories)