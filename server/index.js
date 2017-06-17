const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()

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

app.post('/webhook', (req, res, next) => {
	console.log('REQUEST: ', req, req.body)
	return req
})

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../public'))
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Gitbot listening on port 3000');
});
