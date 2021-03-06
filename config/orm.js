let connection = require("./connection");

// Helper function for SQL syntax.
function printQuestionMarks(num) {
    var arr = [];

    for (var i = 0; i < num; i++) {
        arr.push("?");
    }

    return arr.toString();
};
// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
    var arr = [];
    // loop through the keys and push the key/value as a string into arr
    for (let key in ob) {
        let value = ob[key];
        // check to skip hidden properties
        if (Object.hasOwnProperty.call(ob, key)) {
            // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
            if (typeof value === "string" && value.indexOf(" ") >= 0) {
                value = "'" + value + "'";
            }
            // push into array
            arr.push(key + "=" + value);
        }
    }
    // translate array of strings to a single comma-separated string
    return arr.toString();
};


let orm = {
    // query to select all from table
    selectAll: function (table, cb) {
        let queryString = `SELECT * FROM ${table}`
        connection.query(queryString, function (err, result) {
            if (err) {
                throw err;
            }
            cb(result);
        });
    },
    // query to insert new item into table
    insertOne: function (table, cols, vals, cb) {
        let queryString = `INSERT INTO ${table} (${cols.toString()}) VALUES (${printQuestionMarks(vals.length)});`

        console.log(queryString);
        connection.query(queryString, vals, function (err, result) {
            if (err) throw err;

            cb(result);
        });
    },
    // query to update item listing
    updateOne: function (table, objColVals, condition, cb) {
        let queryString = `UPDATE ${table} SET ${objToSql(objColVals)} WHERE ${condition}`;
        console.log(queryString);

        connection.query(queryString, function (err, result) {
            if (err) throw err;

            cb(result);
        });
    }
};

// export orm to be used in models
module.exports = orm;