/**
 * Created by admin on 2017/12/14.
 */
const http = require("http");

const superagent = require("superagent");
const cheerio = require("cheerio");

let server = http.createServer((req, res) => {
    if (req.url === "/favicon.ico") {
        res.end();
        return;
    }
    res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});

    superagent.get("http://www.cnblogs.com/xuxinkun/p/8036832.html ")
        .end((err, result) => {
            let $ = cheerio.load(result.text);
            console.log(result)
            let profile_block = $("#blog_stats").toString();
            res.write(`result: ${profile_block} </br>`);
            res.end()
        })
});

server.listen(3000, "127.0.0.1");