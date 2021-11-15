const fs = require('fs')
const path = require('path');
const inquirer = require('inquirer');
const readline = require('readline')

const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}
let currentDirectory = process.cwd()
const questions = {
    fileName: {
            name: "fileName",
            type: "list",
            message: "Choose file:",
            choices: () => ['../', 'ENTER AN ABSOLUTE PATH', ...fs.readdirSync(currentDirectory)],
            when: () => !isFile(currentDirectory)
    },
    exit: {
            name: "exit",
            type: "confirm",
            message: "Do you want to exit?"

    },
    close: {
            name: "close",
            type: "confirm",
            message: "Do you want to close file?"

    },
    search: {
        name: "search",
        type: "input",
        message: "enter a search string",
    },
    absolutePath: {
        name: "absolutePath", 
        type: "input", 
        message: "enter an absolute Path",
    }
}

function searchString (str, val) {
    if (str.indexOf(val) != -1) {
        fs.appendFile(path.join(path.dirname(currentDirectory), `${val}_requests.log`), `${str}\n`, {encoding: 'utf-8'}, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
    else {
        fs.writeFile(path.join(path.dirname(currentDirectory), `${val}_requests.log`), `not results\n`, {encoding: 'utf-8'}, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
}


async function fm() {
    let exit = false
    let prevDirectory = ''
    let absPath = false;
 
    await inquirer
        .prompt(questions.fileName)
        .then((answers) => {
            if (answers.fileName) {
                if (answers.fileName === 'ENTER AN ABSOLUTE PATH') {
                    absPath = true
                    return
                }
                currentDirectory = path.join(currentDirectory, answers.fileName);
            }
        });

    if (absPath) {
        await inquirer
        .prompt(questions.absolutePath)
        .then(answers => {
                prevDirectory = path.resolve(currentDirectory)
                currentDirectory = path.resolve(answers.absolutePath)
            })
    }
    if (isFile(currentDirectory)) {
        fs.readFile(currentDirectory,'utf8', (err, data) => {
                        console.log(data);
                    });
        await inquirer
                .prompt(questions.search)
                .then(answers => {
                    console.log('search', answers);
                    const rl = readline.createInterface({
                        input: fs.createReadStream(currentDirectory)
                    })
                    rl.on('line', (str) => searchString(str, answers.search))
                    rl.on('close', () => console.log('finished'))
                })
        await inquirer
                    .prompt(questions.close)
                    .then(answers => {
                        if (answers.close) {
                            if (prevDirectory) {
                                currentDirectory = path.resolve(prevDirectory)
                                prevDirectory = ''
                                absPath = false
                            } else {
                                currentDirectory = path.dirname(currentDirectory);
                            }
                        }
                    })
    }
        if (exit) {
            return
        } else {
            fm()
        }

}
fm()
