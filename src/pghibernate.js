var postgres = require('pg'),
    uuid = require('node-uuid');

exports.create = function(connectionString) {
    var execute = function(command, handler, error) {
        postgres.connect(connectionString, function(err, client, done) {
            if (err) return error('Postgres connect ' + err);
            client.query(command, function(err, result) {
                done();
                if (err) return error('Postgres query ' + err + ': ' + command);
                handler(result ? result.rows : []);
            });
        });
    };

    var buildQuery = function(query) { 
        var builder = {};
        var escape = function(value) { return "'" + value.replace("'", "''") + "'"; };
        var quote = function(value) { return '"' + value.replace('"', "") + '"'; };
        var dsl = function(action) { return function() { action.apply(this, arguments); return builder; } };
        sql = ''; 
        builder.select = dsl(function() { sql += 'SELECT * '; });
        builder.from = dsl(function(table) { sql += 'FROM ' + table + ' '; });
        builder.where = dsl(function() { sql += 'WHERE '; });
        builder.column = dsl(function(column) { sql += column + ' '; });
        builder.contains = dsl(function(value) { if (value) { sql += 'ILIKE ' + escape('%' + value + '%'); } });
        builder.insert = dsl(function(table, key, data) {
            sql += 'INSERT INTO ' + table + ' (' + key + ', ' + 
                Object.keys(data).map(function(x) { return quote(x); }).join(', ') + 
                ') VALUES (' + escape(uuid.v1()) + ', ' +
                Object.keys(data).map(function(x) { return escape(data[x]); }).join(', ') + ')'
        });
        query(builder);
        return sql;
    };

    return {
        query: function(query, result, error) {
            execute(buildQuery(query), result, error);
        }
    };
}