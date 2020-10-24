import HTTP from 'http';
import config from './config';
import AppRoute from './router/';

const app = new AppRoute();
const port = config.server.port;

const server = HTTP.createServer(app.express);

server.listen(port);
server.on('error', () => {
    console.log(`Port ${port} is already in use.`)
});
server.on('listening', () => {
    console.log(`Server is listening on port ${port}.`)
});