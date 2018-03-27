const fs = require('fs')
const errorPath = 'c:\\etc\\downloads-gc\\errors.txt'
const downloadDirPath = process.env.HOMEDRIVE + process.env.HOMEPATH + '\\Downloads\\'
const directoryContent = fs.readdirSync(downloadDirPath)
const config = JSON.parse(fs.readFileSync('config.json', {encoding: 'utf8'}))

function extensionToCategory(extension) {
    extension = extension.toUpperCase()
    return config.find(entry => entry.fileType.find(x => x === extension))
}

for (let file of directoryContent) {
    const extension = /[\S\s]+\.(\S+)/g.exec(file)
    if (!extension)
        continue

    const category = extensionToCategory(extension[1])
    if (category) {
        const path = downloadDirPath + extensionToCategory(extension[1])

        if (!fs.existsSync(path))
            fs.mkdirSync(path)
        
        const src = downloadDirPath + file
        const dst = path + '\\' + file

        console.log(`Copying ${src} to ${dst}`)

        fs.copyFile(src, dst, error => {
            if (!error)
                fs.unlink(src, error =>
                    (fs.existsSync(errorPath) ? fs.appendFileSync : fs.writeFileSync)(errorPath, error.toString() + '\n'))
        })
    }
}
