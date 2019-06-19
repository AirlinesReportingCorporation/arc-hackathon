var data = {
  offerObj: {
    data: {
      cabin_class: "",
      created_at: "",
      id: "",
      live_mode: "",
      offers: [""],
      passengers: [{}],
      slices: [{}]
    }
  }
};

var app = new Vue({
  el: '#app',
  data: data,
  methods: {

    getOffer: function() {
      var v = this;

      axios.get('/offer_requests', {
          headers: {
            "Access-Control-Allow-Origin": "*",
          }
        })
        .then(function(response) {
          console.log(response.data);
          v.offerObj = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    }

  }
});

app.getOffer();
