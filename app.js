const GIPHY_API_KEY = process.env.GIPHY_API_KEY
const PORT = Number(process.env.PORT) || 3000
const QUERY = process.env.QUERY || 'dog'

if(!GIPHY_API_KEY) {
  throw new Error('GIPHY_API_KEY required')
}

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const giphy = require('giphy-api')(GIPHY_API_KEY);

const FAVICON = path.join(__dirname, 'favicon.png');

async function getGifs() {
  return new Promise((resolve, reject) => {
    try {
      giphy.search({
        q: QUERY,
        rating: 'g',
        limit: 50
      }, function(err, res) {
        // Res contains gif data!
        resolve(res)
      });
    } catch {
      resolve(reject)
    }
  })
}

http.createServer(async(req, res) => {
  const pathname = url.parse(req.url).pathname;
  if (req.method === 'GET' && pathname === '/favicon.ico') {
    renderFavicon(res)
    console.log(`${req.url} - ${res.statusCode}`)
    return;
  }
  const gifs = await getGifs()

  switch (gifs.meta.status) {
    case 401: renderUnauthorized(res)
    break;
    case 200: renderGif(res, gifs)
    break;
    default: renderNotFound(res)
  }
  console.log(`${req.url} - ${res.statusCode}`)
}).listen(PORT);

function renderFavicon(res) {
  // MIME type of your favicon.
  //
  // .ico = 'image/x-icon' or 'image/vnd.microsoft.icon'
  // .png = 'image/png'
  // .jpg = 'image/jpeg'
  // .jpeg = 'image/jpeg'
  res.setHeader('Content-Type', 'image/png');
  fs.createReadStream(FAVICON).pipe(res);
}

function renderNotFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  res.end(`<html><p>No results</p></html>`);
}

function renderGif(res, gifs) {
  const selected = Math.floor(Math.random() * 50)
  const selectedGif = gifs.data[selected]
  const image = selectedGif.images.original
  const {width, height} = scale(image.width, image.height, 500)
  const alt = selectedGif.alt_text || selectedGif.title || QUERY
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`<html><p>Hello from Nodejs and ${QUERY}tv, now with more ${QUERY}s</p><img src="${image.url}" alt="${alt}" width="${width}" height="${height}"></html>`);
}

function renderUnauthorized(res) {
  res.statusCode = 401;
  res.setHeader('Content-Type', 'text/html');
  res.end(`<html><p>Invalid GIPHY_API_KEY</p></html>`);
}

function scale(width, height, toWidth) {
  const ratio = toWidth / width
  const toHeight = height * ratio
  return { width: toWidth, height: toHeight }
}