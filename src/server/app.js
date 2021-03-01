import express from "express"
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputFileDirectoryPath = '../public/output';
const clientFileDirectoryPath = '../client';

const app = express();
const port = process.env.PORT || 5000;


app.use(express.static(path.join(__dirname, '../client')));

app.get('/:jsonFile', (request, response) => {
    response.sendFile(path.join(__dirname, outputFileDirectoryPath, request.params.jsonFile));
})


app.listen(port, () => { console.log(`server started on port ${port}....`); });