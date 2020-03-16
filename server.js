const express = require('express');

const router = require('./blog-router.js');

const server = express();
server.use(express.json());

server.use('/api/posts', router);

server.get('/', (req, res) => {
    res.send(`
    <h2>Blog Posts API</h2>
    <p>We're not fake news.</p>
    `);
});

module.exports = server;