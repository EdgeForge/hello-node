const http = require('http');
let GIPHY_KEY = process.env.GIPHY_API_KEY
var giphy = require('giphy-api')(GIPHY_KEY);
const PORT = process.env.PORT || 3000;
let ANIMAL = process.env.ANIMAL || 'dog'

// check if ANIMAL is one of the following cat, dog, bird, or yak case insensitive
ANIMAL = ANIMAL.toLowerCase()
console.log("ANIMAL is set to " + ANIMAL)

if(ANIMAL != 'cat' && ANIMAL != 'dog' && ANIMAL != 'bird' && ANIMAL != 'yak') {
  console.log("ANIMAL is not cat, dog, bird, or yak")
  
}
if(GIPHY_KEY == undefined) {
  console.log("no GIPHY_API_KEY set")
}

async function getDog() {
  return new Promise((resolve, reject) => {
    try {
      giphy.search({
        q: ANIMAL,
        rating: 'g',
        limit: 50
      }, function(err, res) {
        // Res contains gif data!
        resolve(res)
      });
    } catch {
      // if there is an error return a string
      error = "search failed, check GIPHY_API_KEY"
      reject(error)
    }
  })
}

http.createServer(async(req, response) => {
  if(GIPHY_KEY == undefined) {
    response.statusCode = 500;
    response.setHeader('Content-Type', 'text/html');
    response.end('<html><p>500 Error, no GIPHY_API_KEY set</p></html>');
    return
  }
  let dog = await getDog()
  if(dog.meta.status == 401) {
    response.statusCode = 401;
    response.setHeader('Content-Type', 'text/html');
    response.end('<html><p>'+ dog.meta.status + 'Error, check GIPHY_API_KEY</p></html>');
    return
  }
  if (dog.meta.status == 200) {
  let whichDog = Math.floor(Math.random() * 50)
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    console.log(dog.data[whichDog].images.original.url) 
    response.end('<html><p>Hello from Nodejs and dogtv, now with more dogs</p><img src="' + dog.data[whichDog].images.original.url + '" alt="dogtv" width="500" height="600"></html>');
  }
  else {
    response.statusCode = 500;
    response.setHeader('Content-Type', 'text/html');
    response.end('<html><p>500 Error, unknown</p></html>');
  }
}).listen(PORT);
