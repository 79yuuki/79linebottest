var express = require('express');
var router = express.Router();
var request = require('superagent');
var url = 'https://api.line.me/v2/bot/message/reply';

/* GET home page. */
router.post('/', function(req, res, next) {
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer E0IiIncd16SGcA5R9RS2Vgg/tu9VRhBtQLj/LGS7MGMPO7bmrhMOcRZ6cpU7Lj2kMYf910aWElRTtP3XA9+Rhv2wkguUrdBeA+NNCe+/QW3WP7P6FkgSWVMMe1oyQn4tShCSxkbhkx9MaZSUUB0wfgdB04t89/1O/w1cDnyilFU='
  };

  console.log(req.body.events[0]);

  var event = req.body.events[0];
  if (event !== 'beacon') {
    replyMessage('Beaconに近づいてね！', event);
  }

  var token = event.replyToken;
  var message = 'Hello beacon!';
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
    console.log(err, res);
  });

  //res.status(200);
});

module.exports = router;
