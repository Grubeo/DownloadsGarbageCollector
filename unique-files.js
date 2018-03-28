const fs = require('fs')
const fileCompare = require('file-compare').compare
const compareFiles = (first, second) =>
    new Promise(resolve => fileCompare(first, second, (data) => resolve([data, first])))


module.exports = Bacon => dirpath => {
    const dirContent = fs.readdirSync(dirpath)

    return Bacon.fromArray(dirContent)
        .map(relative => dirpath + relative)
        .flatMap(target => 
            Bacon.fromArray(dirContent)
                .map(relative => dirpath + relative)
                .filter(x => x !== target)
                .filter(x => fs.statSync(target).size === fs.statSync(x).size)
                .flatMap(file => Bacon.fromPromise(compareFiles(file, target)))
                .filter(result => result[0])
                .map(result => [result[1], target])
        )
        .map(([first, second]) => fs.statSync(first).mtimeMs < fs.statSync(second).mtimeMs ? first : second)
        .skipDuplicates()
}