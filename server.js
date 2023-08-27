const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const route = require('./app/routes')

const app = express();

const config = require('./app/configs');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false,
}))

const pathConfig = require('./path');
global.__base = __dirname + '\\app\\';
global.__path_app = __base + pathConfig.folder_app + '\\';

global.__path_models = __base + pathConfig.folder_models + '\\';
global.__path_routers = __base + pathConfig.folder_routers + '\\';
global.__path_schemas = __base + pathConfig.folder_schemas + '\\';
global.__path_configs = __base + pathConfig.folder_configs + '\\';

// const systemConfig = require(__path_configs + 'system');
const databaseConfig = require(__path_configs + 'database');

mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.mx0jt0i.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`)
    .then(() => {
        console.log(`Database connected`)
    })
    .catch((err) => {
        console.log(`Error connecting to database`) 
    });

route(app);

app.get('/', (req, res) => {
    res.send('Hello world');
});


const PORT = config.app.port;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});
