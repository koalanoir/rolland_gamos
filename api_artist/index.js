const express = require('express');
const request = require('request');
const app = express();

// Récupérer la liste des artistes
app.get('/artists', function(req, res) {
  request('https://api.deezer.com/search/artist?q=professional', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const artists = JSON.parse(body).data;
      res.send(artists);
    } else {
      res.status(response.statusCode).send({ error: error });
    }
  });
});

// Récupérer les musiques d'un artiste
app.get('/artists/:id/tracks', function(req, res) {
  const id = req.params.id;
  request(`https://api.deezer.com/artist/${id}/top?limit=10`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const tracks = JSON.parse(body).data;
      res.send(tracks);
    } else {
      res.status(response.statusCode).send({ error: error });
    }
  });
});



// Vérifier si deux artistes ont fait un featuring
app.get('/featuring', function(req, res) {
    const artist1 = req.query.artist1;
    key="";
    const artist2 = req.query.artist2;
    const query = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artist1}%20${artist2}&api_key=${key}&format=json`;
  
    request(query, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const tracks = JSON.parse(body).toptracks.track;
        const featuring = tracks.some((track) => {
          return track.artist.some((artist) => {
            return artist.name == artist1 || artist.name == artist2;
          });
        });
        res.send({ featuring: featuring });
      } else {
        res.status(response.statusCode).send({ error: error });
      }
    });
  });
  
  app.listen(3000, function() {
    console.log('Server is listening on port 3000');
  });
  
  
  
  