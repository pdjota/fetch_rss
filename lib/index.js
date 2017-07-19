const fs = require('fs');
const path = require('path');
const request = require('request');


function readDocumentFromFile (path) {
    const file = fs.readFileSync(path, 'utf-8');
    return file;
}

/* Given a document, parse it and extract all the links included */
function extractDonwloadLinks (doc) {
    const links = [];
    const mp3regex = /enclosure url="(.*?)"/;
    const lines = doc.split("\n");
    lines.forEach( line => {
        const match = line.match(mp3regex);
        if (match && match[1]) {
            links.push(match[1]);
        }
    });
    return links;
}

function downloadLink(url, dir, callback) {
    const fileName = url.substr(url.lastIndexOf('/') + 1);
    const fileLocation = path.join(dir, fileName);

    console.log('downloading', fileName);

    request(url, {encoding: null}, (error, response, body) => {
        if (error) {
            console.error('could not retrieve file', fileName, error);
            callback(error);
        }

        fs.writeFile(fileLocation, body, (fsError) => {
            if (fsError) {
                console.error('could not retrieve file', fileName, fsError);
                callback(fsError);                
            }
            callback(null, fileName);
        });
    });
}

module.exports = {
    readDocumentFromFile: readDocumentFromFile,
    extractDonwloadLinks: extractDonwloadLinks,
    downloadLink: downloadLink
};
