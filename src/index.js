import HTTP from 'http';
import AppRoute from './router/';
import config from './config';

const app = new AppRoute();
const port = config.server.port;

const server = HTTP.createServer(app.express);

server.listen(process.env.PORT || port);
server.on('error', () => {
    console.log(`Port ${process.env.PORT || port} is already in use.`)
});
server.on('listening', () => {
    console.log(`Server is listening on port ${process.env.PORT || port}.`)
});