import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import http from 'http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = http.createServer((request, response) => {
    if (request.url == '/') {
        response.write(fs.readFileSync(path.resolve(__dirname, '../client/index.html'), 'utf-8', (err, HTMLdata) => {
            if (err) {
                return '404';
            }
            else {
                console.log(request.url);
                response.writeHead(200, { 'Content-Type': 'text/html' });
                return HTMLdata;
            }
        }))
    }
    else if (request.url == '/charts.js') {
        response.write(fs.readFileSync(path.resolve(__dirname, '../client/charts.js'), 'utf-8', (err, HTMLdata) => {
            if (err) {
                return '404';
            }
            else {
                console.log(request.url);
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                return HTMLdata;

            }
        }))

    }
    else if (request.url == '/matchesPerYear.json') {
        response.write(fs.readFileSync(path.resolve(__dirname, '../public/output/matchesPerYear.json'), 'utf-8', (err, HTMLdata) => {
            if (err) {
                return '404';
            }
            else {
                console.log(request.url);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                return HTMLdata;

            }
        }))

    }
    else if (request.url == '/economicalBowlers2015.json') {
        response.write(fs.readFileSync(path.resolve(__dirname, '../public/output/economicalBowlers2015.json'), 'utf-8', (err, HTMLdata) => {
            if (err) {
                return '404';
            }
            else {
                console.log(request.url);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                return HTMLdata;

            }
        }))

    }
    else if (request.url == '/extraRunPerTeam2016.json') {
        response.write(fs.readFileSync(path.resolve(__dirname, '../public/output/extraRunPerTeam2016.json'), 'utf-8', (err, HTMLdata) => {
            if (err) {
                return '404';
            }
            else {
                console.log(request.url);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                return HTMLdata;

            }
        }))

    }
    else if (request.url == '/matchesWonPerTeam.json') {
        response.write(fs.readFileSync(path.resolve(__dirname, '../public/output/matchesWonPerTeam.json'), 'utf-8', (err, HTMLdata) => {
            if (err) {
                return '404';
            }
            else {
                console.log(request.url);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                return HTMLdata;

            }
        }))

    }
    response.end();
}).listen(3000);
console.log('Started 3000');