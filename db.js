/**
 * Created by admin on 2017/12/11.
 */
//  封装一些常用的数据可操作方法
const MongoClient = require("mongodb").MongoClient;

const setting = require("./setting.js");


exports.insert = function (collection, json, callback) {
    _connectDB((err, client) => {
        let db = client.db(setting.dbName);
        if (json instanceof Array) {
            db.collection(collection).insertMany(json, (err, r) => {
                if (err) {
                    console.log(err);
                    return;
                }
                callback(err, r);
            });
        } else {
            db.collection(collection).insertOne(json, (err, r) => {
                if (err) {
                    console.log(err);
                    return;
                }
                callback(err, r);
            });
        }

        client.close();
    });
};

//  连接数据库
function _connectDB(callback) {
    let url = setting.dburl;
    //  连接数据库
    MongoClient.connect(url, (err, client) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        // console.log("数据库连接成功")
        callback(err, client)
    })
}