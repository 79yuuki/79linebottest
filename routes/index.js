var express = require('express');
var router = express.Router();
var request = require('superagent');
var url = 'https://api.line.me/v2/bot/message/reply';

var weatherKey = '23ee2b30dac011b53623c815da39f75d';
var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q=London';

var replyMessage = (event, message) => {
  var token = event.replyToken;
  var body = {
    'replyToken': token,
    'messages': [
      {'type': 'text', 'text': message}
    ]
  };

  request.post(url)
  .send(body)
  .set('Content-Type', 'application/json')
  .set('Authorization', 'Bearer E0IiIncd16SGcA5R9RS2Vgg/tu9VRhBtQLj/LGS7MGMPO7bmrhMOcRZ6cpU7Lj2kMYf910aWElRTtP3XA9+Rhv2wkguUrdBeA+NNCe+/QW3WP7P6FkgSWVMMe1oyQn4tShCSxkbhkx9MaZSUUB0wfgdB04t89/1O/w1cDnyilFU=')
  .end((err, res) => {
    console.log('send message!');
  });
};

/* GET home page. */
router.post('/', function(req, res, next) {

  //console.log(req.body.events[0]);

  var event = req.body.events[0];

  if (event.type !== 'beacon') {
    replyMessage(event, 'Beaconに近づいてね！');
  }

  var query = weatherUrl + '?zip=151-0053,JP&APPID=#{' + weatherKey + '}';
  request.get(query)
  .end((err, res) => {
    if (err) {
      return replyMessage(event, 'WeatherAPI Error...');
    }
    let weather = res.body.weather[0];

    replyMessage(event, weather.main + ', ' + weather.description);
  });
});

module.exports = router;
