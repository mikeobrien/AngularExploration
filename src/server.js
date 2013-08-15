var express = require('express'),
    postgres = require('pg');

var connection = "postgres://localhost/library";

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/books', function(req, res) {
    postgres.connect(connection, function(err, client, done) {
            filter = req.query.q ? " WHERE title ILIKE '%" + req.query.q + "%'" : '';
            client.query('SELECT * FROM books' + filter, function(err, result) {
            done();
            res.send(result.rows);
        });
    });
});

app.listen(5150);