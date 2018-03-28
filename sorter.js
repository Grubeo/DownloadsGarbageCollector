const fs = require('fs')
const errorPath = 'errors.txt'

module.exports = function(systemInfo, directories) {
    console.log(systemInfo)
    const directoryContent = 
        fs.readdirSync(systemInfo.downloadsPath)
        .filter(path => !fs.statSync(systemInfo.downloadsPath + systemInfo.separator + path).isDirectory())

    function extensionToCategory(extension) {
        extension = extension.toUpperCase()
        return directories.find(entry => entry.fileType.find(x => x === extension))
    }

    for (let file of directoryContent) {
        const extension = /[\S\s]+\.(\S+)/g.exec(file)
        if (!extension)
            continue

        const category = extensionToCategory(extension[1])
        if (category) {
            const path = systemInfo.downloadsPath + systemInfo.separator + extensionToCategory(extension[1]).name
            if (!fs.existsSync(path))
                fs.mkdirSync(path)
            
            const src = systemInfo.downloadsPath + systemInfo.separator + file
            const dst = path + systemInfo.separator + file

            console.log(`Copying ${src} to ${dst}`)

            fs.copyFile(src, dst, error => {
                if (!error)
                    fs.unlink(src, error =>
                        (fs.existsSync(errorPath) ? fs.appendFileSync : fs.writeFileSync)(errorPath, error + '\n'))
            })
        }
    }
}