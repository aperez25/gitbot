const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()

app

.use(morgan('dev'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended: true}))

.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
})


.use(express.static(path.join(__dirname,
 '../public')))
.use(express.static(path.join(__dirname, '..', 'node_modules/jquery/dist')))
.use(express.static(path.join(__dirname, '..', 'node_modules/bootstrap/dist')))
.use('/api', require('./api'))


.get('/*', function (req, res) {
  res.redirect('/')
})

.listen(process.env.PORT || 3000, function () {
  console.log('Gitbot listening on port 3000');
})
