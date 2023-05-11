const http = require('http');
const PORT = process.env.PORT || 3000;
let CHANNELS = process.env.CHANNELS || ''

// check if CHANNELS is set
if(CHANNELS == '') {
    console.log("no CHANNELS set")
    }
    else {
    console.log("CHANNELS is set to " + CHANNELS)
    }
// check if channels are urls, and if they are, add them to an array
let channels = CHANNELS.split(',')
let urls = []
for (let i = 0; i < channels.length; i++) {
    if(channels[i].startsWith('https://')) {
        urls.push(channels[i])
    }
}
// if there are no urls, log no channels set
if(urls.length == 0) {
    console.log("no channels set")
}
// if there are urls, log them
else {
    console.log("urls are " + urls)
}
// serve the urls as a webpage with an iframe for each url
http.createServer((req, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.write('<html><p>Hello from Nodejs and pettv</p>')
    for (let i = 0; i < urls.length; i++) {
        response.write('<iframe src="' + urls[i] + '" width="500" height="600"></iframe>')
    }
    response.end('</html>');
}
).listen(PORT, () => console.log(`Listening on ${ PORT }`));

