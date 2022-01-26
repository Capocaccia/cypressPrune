const fs = require('fs')
const path = require('path')
const config = JSON.parse(fs.readFileSync('cypress.json'))
const fixtureFileLocation = config.fixturesFolder
const testFileLocation = config.integrationFolder
//get all the fixture file names
let fixtureFileNames = [];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
      let dirPath = path.join(dir, f);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      isDirectory ? 
        walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
};

function search(result) {
    //result = test file path
    const testFileContents = fs.readFileSync(result, {
        encoding: 'utf-8'
    })
    for(fixture of fixtureFileNames) {
        const fixtureFileName = path.basename(fixture);
        const cyFixtureFound = testFileContents.indexOf(`cy.fixture('${fixtureFileName.split('.')[0]}')`) > 0 || testFileContents.indexOf(`cy.fixture('${fixtureFileName}')`) > 0
        const interceptFound = testFileContents.indexOf(`{fixture: ${fixtureFileName.split('.')[0]}}`) > 0 || testFileContents.indexOf(`{fixture: ${fixtureFileName}}`) > 0
        console.log(fixture)
        if(cyFixtureFound || interceptFound) {
            fixtureFileNames.splice(fixtureFileNames.indexOf(fixtureFileName), 1)
        }
    }
}
walkDir(fixtureFileLocation, (result) => {
    fixtureFileNames.push(result)
})
walkDir(testFileLocation, search)
const unused = fixtureFileNames.map((file) => path.basename(file))
console.table(unused)

