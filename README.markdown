#参考于[《Node.js 包教不包会》](https://github.com/alsotang/node-lessons)
## 文件清单
- [app.js](https://github.com/qianlongdoit/crawler/blob/master/app.js)：演示demo入口文件
- [concurrence.js](https://github.com/qianlongdoit/crawler/blob/master/concurrence.js)：async库，限制并发的演示demo
- [db.js](https://github.com/qianlongdoit/crawler/blob/master/db.js)：mongo数据库的封装的方法
- [eventProxy.js](https://github.com/qianlongdoit/crawler/blob/master/eventProxy.js)：eventProxy库的演示demo，用于全部抓取完成后的回调
- [superagent.js](https://github.com/qianlongdoit/crawler/blob/master/superagent.js)：superagent库用于发起http请求，一个简单的应用演示<br>

***

##目的:获取4000个博主的 昵称、园龄、粉丝、关注 数据
### 方法：
1. 从主页获取1~200页的url；
2. 然后从这200个url中获取每页20个blog的url，共4000个url；
3. 从4000个url中获取每个博主的id
4. 通过请求`http://www.cnblogs.com/mvc/blog/news.aspx?blogApp={id}`这样的方式拿到每个博主的昵称、园龄、粉丝、关注等项目的具体数据！


