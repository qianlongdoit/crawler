/**
 * Created by admin on 2017/12/10.
 */
const async = require("async");
let concurrenceCount = 0;

//  准备抓取url列表
let urls = [];
for (let i = 0; i < 30; i++) {
    urls.push('http://datasource_' + i);
}

function fetchUrl(url,callback) {
    let delay = parseInt((Math.random() * 10000000) % 2000);
    concurrenceCount++;
    console.log('现在的并发数是', concurrenceCount, '，正在抓取抓取的是', url, '，耗时', delay, '毫秒');
    setTimeout(() => {
        concurrenceCount--;
        // console.log('现在的并发数是', concurrenceCount, '，正在抓取抓取的是', url, '，耗时', delay, '毫秒');
        callback(null,"0")
    }, delay);
}


async.mapLimit(urls, 5, (url,callback) => {
    fetchUrl(url,callback);
}, (err, result) => {
    if (err){
        console.log(err)
    }
    console.log('final: ');
    console.log(result);
});