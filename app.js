const http = require('http');
var giphy = require('giphy-api')();
const url = require('url');

let breeds = [
  "pug",
  "poodle",
  "retriver",
  "chihuahua",
  "dobermann",
  "mutt"
];

async function getDog(q) {
  return new Promise((resolve, reject) => {
    try {
      giphy.search({
        q: q,
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
  let dogQuery = "dog"
  let dogUrl
  let breed = url.parse(req.url, true).query.breed;
  if(breed){
    if(breeds.includes(breed)){
      console.log("Looking for Breed: %s", breed)
      dogQuery += " "+breed
    } else {
      console.log("BAD DOG")
      dogQuery = "BAD DOG"
    }
  }

  if(dogQuery == "BAD DOG"){
    dogUrl = "https://i.giphy.com/media/owRSsSHHoVYFa/giphy.webp"
  } else {
    let dog = await getDog(dogQuery)
    let whichDog = Math.floor(Math.random() * 50)
    dogUrl = dog.data[whichDog].images.original.url
  }
  
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/html');
  console.log(dogUrl) 
  response.end('<html><p>Hello from Nodejs, where james buys dog tv</p><img src="' + dogUrl + '" alt="dogtv" width="500" height="600"></html>');
}).listen(3000);