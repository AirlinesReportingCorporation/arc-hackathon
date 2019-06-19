var express = require('express'),
  axios = require('axios'),
  exphbs  = require('express-handlebars'),
  config = require('./config');

var app = express();

var hbs = exphbs.create({
	defaultLayout	: 'main',
});

app.use("/public", express.static(__dirname + '/public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

var bearerkey = "Bearer " + config.key;

app.get('/', function(req, res){
  res.render('home');
});

app.get('/offer_requests', function(req, res) {

  var postData = {
    data: {
      "cabin_class": "economy",
      "slices": [{
        "departure_date": "2019-08-08",
        "destination": "JFK",
        "origin": "LON"
      }],
      "passengers": [{
        "type": "adult"
      }]
    }
  };

  let axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip",
      "Duffel-Version": "beta",
      "Access-Control-Allow-Origin": "*",
      "Authorization": bearerkey
    }
  };

  axios.post('https://api.duffel.com/air/offer_requests', postData, axiosConfig)
    .then(response => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
      console.log(error.response.data);
    })

});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
