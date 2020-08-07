//import the framework

const express = require('express');

const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));
const port = 4000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.listen(port, () => {
    console.log(`Server started on port, ${port}`);
});

const routes = require("./src/controllers/index");

routes.forEach(([name, handler]) => app.use(`/${name}`, handler));