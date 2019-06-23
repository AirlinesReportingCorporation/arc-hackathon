var express = require('express'),
  axios = require('axios'),
  exphbs = require('express-handlebars'),
  config = require('./config');

var app = express();

var hbs = exphbs.create({
  defaultLayout: 'main',
});

app.use("/public", express.static(__dirname + '/public'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/plugin", express.static(__dirname + '/plugin'));
app.use("/lib", express.static(__dirname + '/lib'));
app.use("/img", express.static(__dirname + '/lib'));


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

var bearerkey = "Bearer " + config.key;

app.get('/slides', function(req, res) {
  res.render('home', {layout: 'main2'});
});


app.get('/', function(req, res) {
  res.render('home');
});

app.get('/order', function(req, res) {
  var cabin = (req.query.cabin === "economy" || req.query.cabin === "premium_economy" || req.query.cabin === "first" || req.query.cabin === "business") ? req.query.cabin : "economy";

  var offerId = req.query.offerid;
  var amount = req.query.amount;

  var postData = {
    data: {
      "selected_offers": [
        "off_00009k7ARSLrtURBRjuwwS"
      ],
      "passengers": [{
        "type": "adult",
        "given_name": "Ian",
        "family_name": "Fajardo",
        "born_on": "1979-03-01",
        "title": "mr",
        "gender": "m",
        "email": "ifajardo@arccorp.com",
        "phone_number": "+12123456789",
        "id": "pas_00009k7ARFAktUp8ZVcOJc",
        "address_line_2": "Ste 300",
        "address_line_1": "3000 Wilson Blvd",
        "address_city": "Arlington",
        "address_region": "Virginia",
        "address_postal_code": "23453",
        "address_country_code": "US"
      }],
      "payments": [{
        "type": "balance",
        "amount": "3032.55",
        "currency": "EUR"
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

  axios.post('https://api.duffel.com/air/orders', postData, axiosConfig)
    .then(response => {
      console.log("Response loaded from duffel");
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error.response.data);
      console.log(error.response.data);
    })

});


app.get('/getoffer',function(req,res) {

  let axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip",
      "Duffel-Version": "beta",
      "Authorization": bearerkey
    }
  };

  axios.get('https://api.duffel.com/air/offer_requests/', axiosConfig)
    .then(response => {
      console.log("Response loaded from duffel");

      res.send(response.data);
      //var mydata = removeOutOfPolicy(response.data, 7500.00);
      //res.send(mydata);
    })
    .catch((error) => {
      res.send(error);
      console.log(error);
    })
});


app.get('/realoffer', function(req, res) {

  var cabin = (req.query.cabin === "economy" || req.query.cabin === "premium_economy" || req.query.cabin === "first" || req.query.cabin === "business") ? req.query.cabin : "economy";


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

app.get('/offer_requests', function(req, res) {

  var cabin = (req.query.cabin === "economy" || req.query.cabin === "premium_economy" || req.query.cabin === "first" || req.query.cabin === "business") ? req.query.cabin : "economy";

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

  axios.get('http://localhost:8000/public/consolidated.json')
    .then(response => {
      console.log("Response loaded from duffel");
      var mydata = dedupe(response.data);

      res.send(mydata);
      //var mydata = removeOutOfPolicy(response.data, 7500.00);
      //res.send(mydata);
    })
    .catch((error) => {
      res.send(error);
      console.log(error);
    })
  /*
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
  */
});


//functions to define trip friction
// is a isRedEye
// connectionCount
// totalTripTime
function removeOutOfPolicy(mydata, price) {

  var newOffers = [];

  for (var i = 0; i < mydata.data.offers.length; i++) {
    var total = mydata.data.offers[i].total_amount;
    if (total <= price) {
      newOffers.push(mydata.data.offers[i]);
    }
  }

  mydata.data.offers = newOffers;

  return mydata;
}

function getUniqueKeys(offer) {

  var uniqueid = "";

  for (var i = 0; i < offer.slices.length; i++) {
    for (var j = 0; j < offer.slices[i].segments.length; j++) {
      var segments = offer.slices[i].segments[j].marketing_carrier_flight_number;
      var cabin = offer.slices[i].segments[j].passengers[0].cabin_class;
      uniqueid += segments + "" + cabin;
    }
  }

  return uniqueid;
}

function dedupe(mydata) {

  var newOffers = [];

  var offers = mydata.data.offers;

  var map = mydata.data.offers.map(getUniqueKeys);

  var uniques = map.filter(function(item, index, inputArray) {
    return inputArray.indexOf(item) == index;
  });

  //array of matches to loop through
  var matches = [];

  for (var i = 0; i < uniques.length; i++) {

    var uniqueid = uniques[i];

    var match = [];

    //take note of indices
    for (var j = 0; j < map.length; j++) {
      if (uniqueid === map[j]) {

        match.push(j);
      }
    }



    matches.push(match);

  }


  //loop through matches and pick one per i
  for (var i = 0; i < matches.length; i++) {
    var price = offers[matches[i][0]].total_amount;
    var finalIndex = matches[i][0];
    //console.log(price + ":" + finalIndex);
    for (var j = 0; j < matches[i].length; j++) {
      var price2 = offers[matches[i][j]].total_amount;
      var finalIndex2 = matches[i][j];
      if (price2 < price) {
        price = price2;
        finalIndex = finalIndex2;
      }
    }
    console.log("Final Price: " + price);
    newOffers.push(offers[finalIndex]);
    //console.log(offers[finalIndex]);
  }

  mydata.data.offers = newOffers;


  return mydata;
}

function compareArrays(array1, array2) {
  var length = array1.length;

  for (var i = 0; i < length; i++) {
    if (array1[i] != array2[i]) {
      return false;
    }
  }

  return false;
}

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
