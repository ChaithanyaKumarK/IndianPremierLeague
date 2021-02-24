import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import http from 'http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = http.createServer((request, response) => {
    const urlReceived = request.url;

    const pathExtension = urlReceived.split('.').splice(-1)[0];
    urlSwitcher(request, response, pathExtension);
    response.end();
}).listen(3000);
console.log('Started 3000');


function urlSwitcher(request, response, pathExtension) {
    const outputFileDirectoryPath = '../public/output';
    const clientFileDirectoryPath = '../client';
    let htmlFilePAth;

    switch (pathExtension) {
        case '/':
            htmlFilePAth = path.join(__dirname, clientFileDirectoryPath, 'index.html');
            pathAndContentTypeSetter(response, htmlFilePAth, 'text/html');
            break;
        case 'js':
            htmlFilePAth = path.join(__dirname, clientFileDirectoryPath, request.url);
            pathAndContentTypeSetter(response, htmlFilePAth, 'application/javascript');
            break;
        case 'json':
            htmlFilePAth = path.join(__dirname, outputFileDirectoryPath, request.url);
            pathAndContentTypeSetter(response, htmlFilePAth, 'application/json');
            break;
    }

}


//this function writes 
function pathAndContentTypeSetter(response, pathOfFile, contentType) {
    response.write(fs.readFileSync(pathOfFile, 'utf-8', (err, HTMLdata) => {
        if (err) {
            return '404';
        }
        else {
            console.log(request.url);
            response.writeHead(200, { 'Content-Type': contentType });
            return HTMLdata;
        }

    }))

}