const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const route = require('./app/routes')

const app = express();

const config = require('./app/configs');
const path = require("path");
require('dotenv').config();

app.use(cors());

app.use(express.json());
app.use("/image/products", express.static(path.join(__dirname, "./app/uploads/products/")));
app.use("/image/avatars", express.static(path.join(__dirname, "./app/uploads/avatars/")));
app.use(bodyParser.urlencoded({
    extended: false,
}))

const pathConfig = require('./path');
global.__base = __dirname + '\\app\\';
// global.__path_app = __base + pathConfig.folder_app + '\\';

// global.__path_models = __base + pathConfig.folder_models + '\\';
// global.__path_routers = __base + pathConfig.folder_routers + '\\';
// global.__path_schemas = __base + pathConfig.folder_schemas + '\\';
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

require('./passport')

const PORT = config.app.port;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});
