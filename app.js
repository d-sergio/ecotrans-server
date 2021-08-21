const express = require('express');
const app = express();
const port = 3000;
const config = require('./config/config.json');

const messagesRouter = require('./routes/messages');

app.use(express.static('public_html'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public_html/index.html');
});

app.use('/messages', messagesRouter);

app.listen(config.server.port, () => {
    console.log(`Listening at ${port} port`);
});