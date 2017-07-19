const {parallelLimit} = require('async');
const {readDocumentFromFile,
    extractDonwloadLinks,
    downloadLink
} = require('./lib');

const doc = readDocumentFromFile('test/audiotrainer_en.rss');
const links = extractDonwloadLinks(doc);

//now, download all the links, async, and save them in a downloads folder
const tasks = links.map( linkURL => {
    return (callback) => {
        downloadLink(linkURL, './downloads', callback);
    };
});

parallelLimit(tasks, 5, (err, filenames) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Files downloaded:', filenames);
    }
});
