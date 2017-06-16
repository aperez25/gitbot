const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const env = require('dotenv').config()
app.use(morgan('dev'))

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname,
 '../public')))

app.use('/api', require('./api'))

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../public'))
});

app.listen(3000, function () {
  console.log('Gitbot listening on port 3000');
});
