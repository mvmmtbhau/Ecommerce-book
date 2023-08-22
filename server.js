const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const route = require('./app/routes')

const app = express();

const config = require('./app/configs');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false,
}))


route(app);
app.get('/', (req, res) => {
    res.send('Hello world');
});


const PORT = config.app.port;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});
