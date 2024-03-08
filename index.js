try {
    require('dotenv').config()
} catch (e) {
}

const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const morgan = require('morgan')
const path = require('path')

const http = require('http');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())



let { sequelize } = require('./config/connection.js')
sequelize.authenticate().then(function () {
    console.log('Connection with DB has been established successfully.');
}).catch(function (error) {
    console.error('Unable to connect to the database:', error);
});


app.use('/cdn', express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))



app.use('/api', require('./modules/_api.routes'))
app.use('/', require('./views/site.js'))



//CREATE SERVER HTTP
const server = http.createServer(app)

server.listen(process.env.API_PORT | 33533, () => {
    console.log('started at');
    console.log('http://localhost:' + (String(process.env.API_PORT) | '33533'));
});




