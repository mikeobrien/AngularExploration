var express = require('express'),
    pghibernate = require('./pghibernate');

var data = pghibernate.create("postgres://localhost/library");

var app = express();
app.use(express.bodyParser());

app.use(express.static(__dirname + '/public'));

app.get('/books', function(req, res, next) {
    data.query(
        function(query) { 
            query.select().from('books');
            if (req.query.q) query.where().column('title').contains(req.query.q); 
        }, 
        function(data, err) { res.send(data); }, 
        function(error) { next(error); });
});

app.post('/books', function(req, res, next) {
    data.query(
        function(query) { query.insert('books', 'id', req.body); }, 
        function(data) { res.end(); }, 
        function(error) { next(error); });
});

app.use(function(err, req, res, next){
    console.log(err);
    res.send(500, 'A server error occured!');
});

app.listen(5150);