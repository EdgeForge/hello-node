const http = require('http');
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
  response.setHeader('Content-Type', 'application/json');
  // response.end('Hello from Nodejs, where james buys dog tv', dog);
  // console.log(dog.data[0].embed_url)
  console.log(dog.data[whichDog].images.original.url)
  let slackJson = {
    "response_type": "in_channel",
    "blocks": [
      {
              "type": "image",
              "image_url": dog.data[whichDog].images.original.url,
              "alt_text": "dogTV"
      }
    ]
  }
  response.end(JSON.stringify(slackJson));
}).listen(3000);
