var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/no-basket', function(req, res) {
  res.render('index-no-basket');
})

router.get('/js-basket', function(req, res) {
  res.render('index-js-basket');
})

router.get('/css-basket', function(req, res) {
  res.render('index-css-basket');
})

module.exports = router;