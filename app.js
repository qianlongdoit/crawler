/**
 * Created by admin on 2017/12/10.
 */
const http = require("http");
const fs = require("fs");

const superagent = require("superagent");
const cheerio = require("cheerio");
const eventproxy = require("eventproxy");
const async = require("async");

const db = require("./db.js");  //引入自己封装的db操作库

let ep = new eventproxy(),
    count = 0,
    urlsArray = [],
    pageUrls = [],
    pageCount = 200;

//  获取每个page的url
for (let i = 1; i <= pageCount; i++) {
    pageUrls.push("https://www.cnblogs.com/sitehome/p/" + i)
}

function run() {
    function onRequest(req, res) {

        if (req.url === "/favicon.ico") {
            res.end();
            return;
        }

        res.writeHead(200, {"Content-type": "text/html; charset=UTF-8"});

        //  获取每一页的博客url
        pageUrls.forEach(function (v, k) {
            superagent.get(v)
                .end((err, result) => {

                    let $ = cheerio.load(result.text);
                    let curPageUrls = $(".titlelnk");
                    for (let i = 0; i < curPageUrls.length; i++) {
                        let articleUrl = curPageUrls.eq(i).attr('href');
                        //  获取每个blog的url
                        urlsArray.push(articleUrl);
                        ep.emit('BlogArticleHtml', articleUrl)
                    }

                });
        });

        //  爬取完成后做的事情
        //  @parameter:事件名、次数、回调函数
        //                          回调函数的参数为所有抓取
        ep.after('BlogArticleHtml', pageUrls.length * 20, function (articleUrls) {
            res.write("------目标urls获取完成------ </br>");
            //  控制并发数
            let curCount = 0;

            //  抓取每个url
            async.mapLimit(urlsArray, 5, (url, callback) => {
                url = "http://www.cnblogs.com/mvc/blog/news.aspx?blogApp=" + url.split("/")[3];
                // res.write(`现在抓取的是${url} </br>`)
                // callback(null,url);
                _fetchUrl(url, callback)
            }, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log(`一共抓取了：${result.length}条信息`);
            });


            /**抓取单个目标blog的url
             *
             * @param url 获取信息的页面url
             * @param callback async的AsyncFunction(arg1, arg2, ..., callback)，最终的callback形式为callback(err, results...)
             *        当err不存在时，传null作为第一个参数
             * @private 作为延时请求的计时器
             */
            function _fetchUrl(url, callback) {
                curCount++;
                count++;
                let delay = parseInt((Math.random() * 10000000) % 2000);
                //http://www.cnblogs.com/mvc/blog/news.aspx?blogApp={id}
                res.write(`第<b>${count}</b>个现在的并发数是：${curCount}，正在抓取抓取的是 ${url} ， 耗时 <b>${delay}</b> 毫秒。<br/>`);


                setTimeout(() => {
                    curCount--;
                    superagent.get(url)
                        .end((err, sres) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            //  获取网页内容
                            // {decodeEntities: false} 文档不进行解码，解决中文乱码的问题
                            let $ = cheerio.load(sres.text, {decodeEntities: false});

                            // 收集信息
                            let info = $("#profile_block").find("a");
                            let col = {
                                id: info.eq(0).html(),
                                age: info.eq(1).html(),
                                fans: info.eq(2).html(),
                                watch: info.eq(3).html(),
                            };

                            fs.appendFile(
                                "crawler.txt",
                                `昵称：${col.id} 圆龄：${col.age} 粉丝：${col.fans} 关注：${col.watch} \r\n`,
                                (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                }
                            );

                            db.insert("blog", col, (err, result) => {
                                if (err) {
                                    throw err;
                                }
                            });

                        });

                    callback(null, url);
                }, delay);
            }
        });

    }

    http.createServer(onRequest).listen(3000);
}


run();

/**目的 获取4000个博主的 昵称、园龄、粉丝、关注 数据
 *
 * 方法：
 * 1.从主页获取1~200页的url；
 * 2.然后从这200个url中获取每页20个blog的url，共4000个url；
 * 3.从4000个url中获取每个博主的id
 * 4.通过请求http://www.cnblogs.com/mvc/blog/news.aspx?blogApp={id}这样的方式拿到每个博主的
 *   昵称、园龄、粉丝、关注等项目的具体数据！
 */
