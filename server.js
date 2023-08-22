const app = require('./app');
const config = require('./app/configs');

const port = config.app.port;

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});

