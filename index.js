let dotenv = require('dotenv');
dotenv.config();

let api = require('./api');

api.session.create();