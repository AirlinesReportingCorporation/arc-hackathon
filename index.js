var express = require('express'),
  axios = require('axios'),
  exphbs = require('express-handlebars'),
  config = require('./config');

var app = express();

var hbs = exphbs.create({
  defaultLayout: 'main',
});

app.use("/public", express.static(__dirname + '/public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

var bearerkey = "Bearer " + config.key;

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/offer_requests', function(req, res) {

  var cabin = req.query.cabin ? req.query.cabin : "economy";

  var postData = {
    data: {
      "cabin_class": cabin,
      "slices": [{
        "departure_date": "2019-06-24",
        "destination": "LHR",
        "origin": "IAD"
      }, {
        "departure_date": "2019-07-04",
        "destination": "IAD",
        "origin": "LHR"
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
      console.log("Response loaded from duffel");

      var mydata = removeOutOfPolicy(response.data, 3500.00);
      res.send(mydata);
      //var mydata = removeOutOfPolicy(response.data, 7500.00);
      //res.send(mydata);
    })
    .catch((error) => {
      res.send(error);
      console.log(error);
    })

});


//functions to define trip friction
// is a isRedEye
// connectionCount
// totalTripTime
function removeOutOfPolicy(mydata, price) {

  var newOffers = [];

  for (var i = 0; i < mydata.data.offers.length; i++) {
    var total = mydata.data.offers[i].total_amount;
    if(total <= price) {
      newOffers.push(mydata.data.offers[i]);
    }
  }

  mydata.data.offers = newOffers;

  return mydata;
}

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
