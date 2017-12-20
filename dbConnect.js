/**
 * Created by admin on 2017/12/10.
 */
const http = require("http");
const fs = require("fs");

const db = require("./db");

let server = http.createServer((req, res) => {

    res.writeHead(200, {"Content-Type": "text/plain; charset=UTF-8"});
    db.insert("blog", [{name: "Jack", age: 14}], (err, result) => {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify(result))
    });

    fs.appendFile("DBdata.txt", JSON.stringify({name: "Tom", age: 15}) + "\r\n", err => {
        if (err){
            throw err;
        }
        console.log("write files success");
    })
});


server.listen(3000, "127.0.0.1");