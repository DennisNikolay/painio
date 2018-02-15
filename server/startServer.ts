import EchoServer from "./src/EchoServer";

import * as express from 'express';
import * as http from 'http';

const app = express();
const server = http.createServer(app);
EchoServer(server);
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server running on port ${server.address().port}`);
});