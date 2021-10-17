const fs = require('fs')
const path = require('path');
const inquirer = require('inquirer');
const readline = require('readline')
const cluster = require('cluster')
const http = require('http')
const os = require('os')
const url = require('url')


const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

let currentDirectory = 'D:/'

const port = 5555

if (cluster.isMaster) {
    
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {

    http.createServer((request, response) => {
    
    let navigationBlock = `<div style="border: 1px solid black; padding: 10px">`
    let fileContent = `<div style="border: 1px solid black; padding: 10px; width: 500px">`

        if (request.method === 'GET') {
            const queryParams = url.parse(request.url, true).query;
            if (request.url === "/") {
                currentDirectory = 'D:/'
            } else {
                if (request.url != '/favicon.ico') {   
                    if (isFile(path.resolve(request.url.substr(1)))) {
                        const filePath = path.resolve(request.url.substr(1));
                        const data = fs.readFileSync(filePath)
                        fileContent += `${data.toString('utf8')}`;
                        currentDirectory = path.dirname(path.resolve(request.url.substr(1)))

                    } else {
                        currentDirectory = path.resolve(request.url.substr(1))
                    }
                    
                }
            }
            
            let pathUrl = path.resolve(currentDirectory, '../').replace(/(\\|\/)/g, '/') ;
            listDirectory = `<ul class="directoriesList"> <li><a href="http://localhost:${port}/${pathUrl}">../</a></li>`
            for (let i = 0; i < fs.readdirSync(currentDirectory).length; i++) {
                pathUrl = currentDirectory.replace(/(\\|\/)/g, '/') + '/' + fs.readdirSync(currentDirectory)[i];
                listDirectory += `<li><a href="http://localhost:${port}/${pathUrl}">${fs.readdirSync(currentDirectory)[i]}</a></li>`
            }
        listDirectory += '</ul>'
        navigationBlock += listDirectory + '</div>'
        fileContent += '</div>'
        const documentContent = `<div style="display: flex">` + navigationBlock + fileContent + '</div>'

        response.writeHead(200, { 'Content-Type': 'text/html'});
        response.end(documentContent);

        } else if (request.method === 'POST') {
        let data = '';

        request.on('data', chunk => {
            data += chunk;
        });

        request.on('end', () => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);

            response.writeHead(200, { 'Content-Type': 'json'});
            response.end(data);
        });
        } else {
        response.statusCode = 405;
        response.end();
        }  
    }).listen(port, 'localhost');
  }
