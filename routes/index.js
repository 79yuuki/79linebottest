var express = require('express');
var router = express.Router();
var request = require('superagent');
var url = 'https://api.line.me/v2/bot/message/reply';
var weatherCodes = require('../lib/description-jp');

var weatherKey = '23ee2b30dac011b53623c815da39f75d';
var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather';
var weatherForecastUrl = 'http://api.openweathermap.org/data/2.5/forecast';

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

var weatherMainTranslation = (main) => {
  var translation;
  switch(main) {
    case 'Clear':
      translation = '晴れ';
      break;
    case 'Clouds':
      translation = 'くもり';
      break;
    case 'Rain':
      translation = '雨';
      break;
    case 'Snow':
      translation = '雪';
      break;
    default:
      translation = main;
  }
  return translation;
};

/* GET home page. */
router.post('/', function(req, res, next) {

  //console.log(req.body.events[0]);

  var event = req.body.events[0];

  /*if (event.type !== 'beacon') {
    replyMessage(event, 'Beaconに近づいてね！');
  }*/

  var query = '?zip=151-0053,JP&APPID=' + weatherKey;
  request.get(weatherUrl + query)
  .end((err, res) => {
    if (err) {
      return replyMessage(event, 'WeatherAPI Error...');
    }

    // 現在の天気
    var weather = res.body.weather[0];

    var main = weatherMainTranslation(weather.main);
    var temp = res.body.main.temp - 273.15;
    var description = weatherCodes(weather.id).description;
    var nowWeather = '今の天気は' + main + ', ' + description + ', ' + Math.round(temp) + '℃';

    // 今後の天気
    request.get(weatherForecastUrl + query)
    .end((err, res) => {
      if (err) {
        return replyMessage(event, 'WeatherAPI Error...');
      }
      var now = new Date().getTime() / 10000;
      var weatherList = res.body.list;
      var weather = null;
      for (var i=0; weatherList.length > i; i++) {
        var w = weatherList[i];
        if (w.dt > now) {
          if (!weather) {
            weather = w;
          } else {
            // next 3h weather
            var nextWeatherData = weatherCodes(w.weather.id);
            var nextWeather = 'これからの天気は ' + nextWeatherData.main
            + '\n気温は' + (w.main.temp - 273.15) + '℃ \n'
            + nextWeatherData.description + ' です。'
            break;
          }
        }
      };
      replyMessage(event, nowWeather + '\n\n' + nextWeather);
    })
  });
});

module.exports = router;
