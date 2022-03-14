const http = require('unit-http');
var giphy = require('giphy-api')();

async function getDog() {
  return new Promise((resolve, reject) => {
    try {
      giphy.search({
        q: 'dog',
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

http.createServer(async(req, response) => {
  console.log(req.url)
  let dog = await getDog()
  let whichDog = Math.floor(Math.random() * 50)
  response.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  // response.setHeader('Content-Type', 'image/gif');
  response.setHeader('Content-Type', 'text/html');
  // response.end('Hello from Nodejs, where james buys dog tv', dog);
  // console.log(dog.data[0].embed_url)
  console.log(dog.data[whichDog].images.original.url) 
  response.end('<html><p>Hello from Nodejs, where james buys dog tv</p><img src="' + dog.data[whichDog].images.original.url + '" alt="dogtv" width="500" height="600"></html>');
  // response.end('<img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg">');
}).listen(3000);